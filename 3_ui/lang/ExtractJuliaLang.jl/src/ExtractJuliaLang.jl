module ExtractJuliaLang

using Base64
using JSON
using SHA

mutable struct AstNode
    parent_node::Any
    current_node::Any

    function AstNode(parent_node::Any, current_node::Any)
        new(parent_node, current_node)
    end
end

const BASE_LANGUAGE = "en-US"
const SCAN_ROOT_DIR = "julia/packages"

function is_call_node(node)
    return isa(node, Expr) && node.head == :call
end

function is_parameter_node(node)
    return isa(node, Expr) && node.head == :parameters
end

function is_translate_message_node(node)
    return isa(node, QuoteNode) && "$node" == ":translate_message"
end

function is_message_descriptor_node(node)
    return (isa(node, QuoteNode) && "$node" == ":MessageDescriptor") ||  (isa(node, Symbol) && "$node" == "MessageDescriptor")
end

function is_valid_message_descriptor_node(node::AstNode)
    parent_node = node.parent_node
    if isa(parent_node.current_node, Expr)
        next_node = nothing
        next_next_node = nothing
        if is_call_node(parent_node.current_node)
            call_node = parent_node
            index = findfirst(n -> n == node.current_node, parent_node.current_node.args)
            if !isnothing(index) && isassigned(call_node.current_node.args, index + 1) && isassigned(call_node.current_node.args, index + 2)
                next_node = call_node.current_node.args[index+1]
                next_next_node = call_node.current_node.args[index+2]
            end
        else
            call_node = parent_node.parent_node
            if is_call_node(call_node.current_node)
                index = findfirst(n -> n == parent_node.current_node, call_node.current_node.args)
                if !isnothing(index) && isassigned(call_node.current_node.args, index + 1) && isassigned(call_node.current_node.args, index + 2)
                    next_node = call_node.current_node.args[index+1]
                    next_next_node = call_node.current_node.args[index+2]
                end
            end
        end

        if !isnothing(next_node) && !isnothing(next_node)
            if is_parameter_node(next_node)
                next_node = next_next_node
                if isassigned(call_node.current_node.args, index + 3)
                    next_next_node = call_node.current_node.args[index+3]
                else
                    return false
                end
            end

            return isa(next_node, String) && isa(next_next_node, String)
        end
    end
    return false
end

function find_call_node(node)::Union{AstNode,Nothing}
    parent_node = node.parent_node
    current_node = node.current_node

    if isa(current_node, Expr) && current_node.head == :call
        return node
    elseif !isnothing(parent_node)
        return find_call_node(parent_node)
    else
        return nothing
    end
end

function find_lookup_source(node)
    if isa(node, Expr)
        if node.head == :kw
            lookup_index = findfirst(n -> isa(n, Symbol) && n == :lookup_source, node.args)
            if !isnothing(lookup_index)
                next_node =  eval(node.args[lookup_index+1])
                if isa(next_node, Char)
                    return next_node
                end
            end
        else
            for arg in node.args
                lookup_source = find_lookup_source(arg)
                if !isnothing(lookup_source)
                    return lookup_source
                end
            end
        end
    end

    return nothing
end

function find_message_descriptor(node)::Union{AstNode,Nothing}
    current_node = node.current_node
    if isa(current_node, Expr)
        for arg in current_node.args
            message_descriptor_node = find_message_descriptor(AstNode(node, arg))
            if !isnothing(message_descriptor_node)
                return message_descriptor_node
            end
        end
    elseif is_message_descriptor_node(current_node)
        return node
    end

    return nothing
end

function find_message_and_description(node, tuples)
    if isa(node, String)
        tuples = tuple(tuples..., node)
    end

    if isa(node, Expr)
        for arg in node.args
            tuples = find_message_and_description(arg, tuples)
            if length(tuples) == 2
                return tuples
            end
        end
    end

    return tuples
end

function process_i18n_node(node)
    call_node = find_call_node(node)
    if !isnothing(call_node)
        message_descriptor_node = find_message_descriptor(call_node)
        if !isnothing(message_descriptor_node)
            println("use message descriptor to initialize")
            call_node = find_call_node(message_descriptor_node)
        end
        lookup_source = find_lookup_source(call_node.current_node)
        if isnothing(lookup_source)
            lookup_source = Char('l')
        end
        
        result = find_message_and_description(call_node.current_node, ())
        default_message = result[1]
        description = result[2]
        
        @show lookup_source default_message description
        save_translate_message(default_message, description, lookup_source)
        println("")
    end
end

function save_translate_message(default_message::String, description::String, lookup_source::Char)
    text = replace(default_message, '_' => ' ') * (description != "" ? "#$(description)" : "")
    hash =  first(base64encode(sha2_512(text)), 6)

    if !haskey(lookup_code_dict, lookup_source)
        lookup_code_dict[lookup_source] = Dict()
    end

    lookup_code_dict[lookup_source][hash] = Dict{String,String}(
        "defaultMessage" => default_message,
        "untranslatedMessage" => default_message,
        "description" => description
    )
end

function traverse_ast(node::AstNode, indent)
    current_node = node.current_node

    if isa(current_node, Expr)
        for arg in current_node.args
            traverse_ast(AstNode(node, arg), indent + 4)
        end
    elseif is_translate_message_node(current_node)
        process_i18n_node(node)
    elseif is_message_descriptor_node(current_node) && is_valid_message_descriptor_node(node)
        process_i18n_node(node)
    end
end

function process_file(file_path)
    # Your processing logic for each file goes here
    if endswith(file_path, ".jl")
        try
            file_content = read(file_path, String)
            ast = Meta.parse("begin $file_content end")
            traverse_ast(AstNode(nothing, ast), 0)
        catch e
            println("File $file_path cannot be parsed")
            showerror(stdout, e, catch_backtrace())
        end
    end
end

function traverse_directory(root_dir)
    for (root, dirs, files) in walkdir(root_dir)
        for dir in dirs
            traverse_directory(joinpath(root, dir))
        end
        
        for file in files
            process_file(joinpath(root, file))
        end
    end
end

lookup_code_dict = Dict{Char, Dict}()
lookup_code_file_dict = Dict{Char, IOStream}()

function initialize_extract_files()
    output_file_path = "lang/$BASE_LANGUAGE/backEnd/extract"
    if !isdir(output_file_path)
        mkdir(output_file_path)
    end

    files = [Char('a'), Char('l'), Char('v')]
    for file_name in files
        file_path = joinpath(output_file_path, "$file_name.json")
        lookup_code_file_dict[file_name] = open(file_path, "w")
    end
end

# Call the function if the script is run directly
if abspath(PROGRAM_FILE) == @__FILE__
    try 
        initialize_extract_files()
        traverse_directory(SCAN_ROOT_DIR)
    finally 
        for file_name in keys(lookup_code_file_dict)
            output_dict = get(lookup_code_dict, file_name, Dict())
            output_file_io_stream = lookup_code_file_dict[file_name]

            try
                write(output_file_io_stream, JSON.json(output_dict, 2))
            finally
                close(output_file_io_stream)
            end
        end
    end

    #=
    # function to output AST to file
    function traverse_ast(node, indent, output_file)
        write(output_file, "$(repeat(" ", indent))Type: $(typeof(node))")

        if isa(node, Expr)
            write(output_file, "$(repeat(" ", indent + 2))Head: $(node.head)")

            for arg in node.args
                write(output_file, "\n")
                traverse_ast(arg, indent + 4, output_file)
            end
        elseif isa(node, Symbol)
            write(output_file, "$(repeat(" ", indent + 2))Symbol: $node")
        else
            write(output_file, "$(repeat(" ", indent + 2))Value: $node")
        end
    end

    file_path="julia/packages/Utils.jl/src/i18nMessages.jl"
    file_content = read(file_path, String)
    ast = Meta.parse("begin $file_content end")

    output_file_path = "lang/ast.txt"
    open(output_file_path, "w") do file
        traverse_ast(ast, 0, file)
    end
    =#
end

end # module
