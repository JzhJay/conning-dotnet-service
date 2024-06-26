# Copyright © 2017 Conning, Inc.  All Rights Reserved.
# David Weiss

#=

To generate the svg files in the "ui/src/iconning/svg" folder and the
"ui/src/iconning/julia/icons.html" file run the function (include this file):

include("ui/src/iconning/julia/icons.jl")

after first starting Julia from the root of the repo (the thing that the above
paths/files are relative to)

=#
using Charts
using Random
using Statistics

import Base.(-)
-(a::Union{String, Symbol}, b::Union{String, Symbol, Number}) = string(a) * "-" * string(b)
-(a::Number, b::Union{String, Symbol})                        = string(a) * "-" * string(b)

quotestring(s) = "\"" * s * "\""

function indent(n)
    r = ""
    for i in 1:n
        r = r * " "
    end
    return r
end

writeln(stream::IO, i, x) = write(stream, indent(i), x, "\n")

function valuestring(values)
    r = ""
    if isa(values, Vector)
        r = ""
        for (i, value) in enumerate(values)
            r = r * valuestring(value)
            if i < length(values)
                r = r * " "
            end
        end
        return r
    else
        return string(values)
    end
end

function keyvaluestring(keyvalues)
    r = ""
    for (i, (key, value)) in enumerate(keyvalues)
        r = r * string(key) * "=" * quotestring(valuestring(value))
        if i < length(keyvalues)
            r = r * " "
        end
    end
    return r
end

function begintag(f, s, tag, keyvalues)
    writeln(f, s.indent, "<" * string(tag) * " " * keyvaluestring(keyvalues) * ">")
    s.indent += s.indent_spaces
    return
end
function begintag(f, s, tag)
    writeln(f, s.indent, "<" * string(tag) * ">")
    s.indent += s.indent_spaces
    return
end
function endtag(f, s, tag)
    s.indent -= s.indent_spaces
    writeln(f, s.indent, "</" * string(tag) * ">")
    return
end

tag(f, s, tag, keyvalues) = writeln(f, s.indent, "<" * string(tag) * " " * keyvaluestring(keyvalues) * "/>")
comment(f, s, c) = writeln(f, s.indent, "<!" * c * ">")

beginendtag(f, s, tag, content) = writeln(f, s.indent, "<" * string(tag) * ">" * string(content) * "</" * string(tag) * ">")

beginsvg(IO, s, label) = begintag(IO, s, :svg, [ :version        => s.version,
                                                 :xmlns          => s.xmlns,
                                                 :width          => s.size,
                                                 :height         => s.size,
                                                 :data - :icon   => label - s.size,
                                                 :class          => vcat(s.svg_classes, [s.base - label - s.size]),
                                                 :viewBox        => [0, 0, s.size, s.size],
                                                 :id             => string(label, s.size)])

function svg_title_g(s, label, title)
    f = open(joinpath(s.directory, ((label - s.size) * ".svg")), "w")
    beginsvg(f, s, label)
    begintag(f, s, :g, [:class => s.base - :metadata])
    beginendtag(f, s, :title, title)
    endtag(f, s, :g)
    begintag(f, s, :g, [:class          => s.base - :container,
                        :data - :width  => s.size,
                        :data - :height => s.size])
    return f
end

function end_g_svg(f, s)
    endtag(f, s, :g)
    endtag(f, s, :svg)
    close(f)
end

scale_to(x, y) = x .* (y / maximum(x))

mutable struct SvgParameters
    directory::String
    size::Int64
    xmlns::String
    version::Float64
    base::String
    svg_classes::Vector{String}
    stroke_color::String
    fill_color::String
    background_color::String
    up_color::String
    down_color::String
    padding::Float64
    plot_stroke_size::Float64
    plot_x_origin::Float64
    plot_y_origin::Float64
    plot_width::Int64
    plot_height::Int64
    axis_stroke_size::Float64
    axis_tick_spacing::Float64
    axis_number_major_ticks::Float64
    axis_number_minor_ticks::Float64
    axis_length_major_ticks::Float64
    axis_length_minor_ticks::Float64
    bar_column_count::Int64
    bar_column_heights::Vector{Float64}
    bar_column_width::Float64
    bar_column_spacing::Float64
    percentile_ranges::Int64
    box_lower::Vector{Float64}
    box_upper::Vector{Float64}
    histogram_column_count::Int64
    histogram_column_width::Float64
    histogram_column_spacing::Float64
    histogram_column_heights::Vector{Float64}
    scatter_radius::Float64
    scatter_count::Int64
    scatter_x::Vector{Float64}
    scatter_y::Vector{Float64}
    square_cell_count::Int64
    square_cell_size::Float64
    square_cell_spacing::Float64
    indent_spaces::Int64
    indent::Int64
    frontier_points::Int64
    frontier_stroke_size::Float64
    point_radius::Float64
    time_steps::Int64
    flip::Function
end

function SvgParameters(size::Int64)
    directory               = joinpath(dirname(dirname(@__FILE__)), "svg", "static")
    xmlns                   = "http://www.w3.org/2000/svg"
    version                 = 1.1
    base                    = "iconning"
    svg_classes             = [base]
    stroke_color            = "rgb(  0,  0,  0)"
    fill_color              = "rgb( 40, 70,200)" # "rgb(80,131,220)"
    background_color        = "rgb(255,255,255)"
    up_color                = "rgb(  0, 98, 37)"
    down_color              = "rgb(138, 32,  3)"
    padding                 = max(0, floor(log2(size)) - 4)
    axis_stroke_size        = max(1, floor(log2(size)) - 4)
    axis_tick_spacing       = max(3 * axis_stroke_size, floor(log2(size)) - 2)
    plot_height             = size - (2 * padding) - axis_stroke_size
    axis_number_major_ticks = floor(plot_height / (2 * axis_tick_spacing))
    axis_number_minor_ticks = floor((plot_height + axis_tick_spacing) / (2 * axis_tick_spacing))
    axis_length_major_ticks = axis_stroke_size * 2
    axis_length_minor_ticks = axis_stroke_size
    plot_stroke_size        = max(1, 1.5 * (log2(size) - 2.5))
    plot_x_origin           = padding + 2 * axis_stroke_size + axis_length_major_ticks
    plot_y_origin           = size - (padding + 2 * axis_stroke_size)
    plot_width              = size - (padding + plot_x_origin + axis_stroke_size)
    plot_height             = (axis_number_major_ticks + axis_number_minor_ticks) * axis_tick_spacing - (2 * axis_stroke_size)
    bar_column_count        = clamp(Int(floor(log2(size))) - 1, 2, 7)
    bar_column_heights      = floor.([0.7, 0.4, 0.95, 0.75, 0.5, 0.15, 0.45][1:bar_column_count] .* plot_height) # (plot_height / 3) .+ rand(MersenneTwister(67), bar_column_count) * plot_height / 1.5 # floor([0.4, 0.9, 0.7] * plot_height)
    bar_column_width        = floor(6//8 * plot_width / (bar_column_count - 2//8))
    bar_column_spacing      = floor((plot_width - bar_column_count * bar_column_width) / (bar_column_count - 1))
    percentile_ranges       = max(1, Int(floor(log2(size))) - 3)
    # box_lower               = rand(MersenneTwister(20), bar_column_count) .* (plot_height / 3)
    # box_upper               = (box_lower .+ plot_height / 6) .+ rand(MersenneTwister(24), bar_column_count) .* (plot_height / 2)
    box_lower               = (plot_height / 3) .- ((1:bar_column_count) ./ bar_column_count .* (plot_height / 3))
    box_upper               = (plot_height / 3) .+ ((1:bar_column_count) ./ bar_column_count .* (plot_height / 1.5))
    histogram_column_count  = 1 + (2 * Int(floor(log2(size))) - 4)
    histogram_column_width  = floor(3//4 * plot_width / (histogram_column_count - 1//4))
    histogram_column_spacing= floor((plot_width - histogram_column_count * histogram_column_width) / (histogram_column_count - 1))
    histogram_column_heights= ceil.((0.05 * plot_height) .+ (0.9 * plot_height) .* histogram_normal(3.0, histogram_column_count))
    scatter_radius          = plot_width / (12 * ((log2(max(size, 16)) - 3))) # plot_width / (2 * ((log2(size) - 1)))
    scatter_count           = clamp(Int(floor(log2(size)^2.5)) - 1, 2, 200)
    scatter_x               = (plot_width / 2) .+ (plot_width / 2.5) .* randn(MersenneTwister(0), scatter_count)
    scatter_y               = (scatter_x .+ (plot_width / 2) .+ (plot_width / 4) .* randn(MersenneTwister(1), scatter_count)) / 2
    i                       = (scatter_x .>= scatter_radius) .&
                              (scatter_x .<= plot_width - scatter_radius) .&
                              (scatter_y .>= scatter_radius) .&
                              (scatter_y .<= plot_height - scatter_radius)
    scatter_x               = scatter_x[i]
    scatter_y               = scatter_y[i]
    square_cell_count       = max(3, floor(log2(size - 2 * padding)))
    square_cell_size        = floor(5//6 * (size - 2 * padding) / (square_cell_count - 1//6))
    square_cell_spacing     = floor(((((size - 2 * padding) - 1)) - (square_cell_size * square_cell_count)) / (square_cell_count - 1))
    indent_spaces           = 4
    indent                  = 0
    frontier_points         = 2 + max(1, floor(1.5 * (log2(size) - 3.2)))
    frontier_stroke_size    = max(1, log2(size) - 3)
    point_radius            = 1.2 + 1.25 * frontier_stroke_size
    time_steps              = max(3, floor(log2(size) - 1.5))
    flip                    = x -> size - x
    SvgParameters(  directory,
                    size,
                    xmlns,
                    version,
                    base,
                    svg_classes,
                    stroke_color,
                    fill_color,
                    background_color,
                    up_color,
                    down_color,
                    padding,
                    plot_stroke_size,
                    plot_x_origin,
                    plot_y_origin,
                    plot_width,
                    plot_height,
                    axis_stroke_size,
                    axis_tick_spacing,
                    axis_number_major_ticks,
                    axis_number_minor_ticks,
                    axis_length_major_ticks,
                    axis_length_minor_ticks,
                    bar_column_count,
                    bar_column_heights,
                    bar_column_width,
                    bar_column_spacing,
                    percentile_ranges,
                    box_lower,
                    box_upper,
                    histogram_column_count,
                    histogram_column_width,
                    histogram_column_spacing,
                    histogram_column_heights,
                    scatter_radius,
                    scatter_count,
                    scatter_x,
                    scatter_y,
                    square_cell_count,
                    square_cell_size,
                    square_cell_spacing,
                    indent_spaces,
                    indent,
                    frontier_points,
                    frontier_stroke_size,
                    point_radius,
                    time_steps,
                    flip)
end

function grid_lines(IO, s)
    classes = [s.base, s.base - :grid - :lines - :axes]
    y_height = s.axis_tick_spacing * max(2 * s.axis_number_major_ticks, 2 * s.axis_number_minor_ticks - 1) + s.padding + s.axis_stroke_size
    padding = s.padding + s.axis_stroke_size / 2
    comment(IO, s, "-- Axes --")
    tag(IO, s, :line, [ :stroke             => s.stroke_color,
                        :stroke - :width    => s.axis_stroke_size,
                        :stroke - :linecap  => :butt,
                        :class              => classes,
                        :x1                 => padding,
                        :y1                 => s.flip(s.padding),
                        :x2                 => padding,
                        :y2                 => s.flip(y_height) ] )
    tag(IO, s, :line, [ :stroke             => s.stroke_color,
                        :stroke - :width    => s.axis_stroke_size,
                        :stroke - :linecap  => :butt,
                        :class => classes,
                        :x1 => s.padding,
                        :y1 => s.flip(padding),
                        :x2 => s.flip(s.padding),
                        :y2 => s.flip(padding) ] )
    comment(IO, s, "-- Major Tick Marks --")
    classes = [s.base, s.base - :grid - :lines - :tick - :marks, s.base - :grid - :lines - :tick - :major]
    x1 = s.padding + s.axis_stroke_size
    x2 = x1 + s.axis_length_major_ticks
    y = s.flip(s.padding + s.axis_stroke_size / 2)
    for i in 1:s.axis_number_major_ticks
        y -= 2 * s.axis_tick_spacing
        tag(IO, s, :line, [ :stroke             => s.stroke_color,
                            :stroke - :width    => s.axis_stroke_size,
                            :stroke - :linecap  => :butt,
                            :class              => classes,
                            :x1                 => x1,
                            :y1                 => y,
                            :x2                 => x2,
                            :y2                 => y ] )
    end
    comment(IO, s, "-- Minor Tick Marks --")
    classes = [s.base, s.base - :grid - :lines - :tick - :marks, s.base - :grid - :lines - :tick - :minor]
    x2 = x1 + s.axis_length_minor_ticks
    y = s.flip(s.padding + s.axis_stroke_size / 2) + s.axis_tick_spacing
    for i in 1:s.axis_number_minor_ticks
        y -= 2 * s.axis_tick_spacing
        tag(IO, s, :line, [ :stroke             => s.stroke_color,
                            :stroke - :width    => s.axis_stroke_size,
                            :stroke - :linecap  => :butt,
                            :class              => classes,
                            :x1                 => x1,
                            :y1                 => y,
                            :x2                 => x2,
                            :y2                 => y ] )
    end
end

function simulation(s)
    IO = svg_title_g(s, :simulation, "Simulation")
    classes = [s.base, s.base - :simulation, s.base - :simulation - s.size]
    comment(IO, s, "-- Scenario Lines --")
    x1 = s.padding + s.frontier_stroke_size / 2
    x2 = s.flip(x1)
    y1 = s.size / 2
    y2 = x1
    db = (x2 - x1) / s.time_steps
    ds = db / 2
    for i in 1:s.time_steps
        tag(IO, s, :line, [     :class              => vcat(classes, s.base - :line),
                                :x1                 => x1,
                                :x2                 => x2,
                                :y1                 => y1,
                                :y2                 => y2,
                                :stroke             => s.stroke_color,
                                :stroke - :width    => s.frontier_stroke_size,
                                :stroke - :linecap  => :round,
                                :style              => "fill:none" ] )
        x1 += db
        y1 += ds
        y2 += db
    end
    x1 = s.padding + s.frontier_stroke_size / 2
    x2 = s.flip(x1)
    y1 = s.size / 2
    y2 = x2
    for i in 1:s.time_steps
        tag(IO, s, :line, [     :class              => vcat(classes, s.base - :line),
                                :x1                 => x1,
                                :x2                 => x2,
                                :y1                 => y1,
                                :y2                 => y2,
                                :stroke             => s.stroke_color,
                                :stroke - :width    => s.frontier_stroke_size,
                                :stroke - :linecap  => :round,
                                :style              => "fill:none" ] )
        x1 += db
        y1 -= ds
        y2 -= db
    end
    end_g_svg(IO, s)
end

function investment_optimization(s)
    IO = svg_title_g(s, :investment - :optimization, "Investment Optimization")
    classes = [s.base, s.base - :investment_optimization, s.base - :investment_optimization - s.size]
    comment(IO, s, "-- Frontier Line --")

    point_radius = s.frontier_stroke_size * 1.5
    line_start_x = s.padding + max(point_radius, s.frontier_stroke_size / 2)
    line_start_y = s.flip(line_start_x)
    line_radius  = s.flip(2 * line_start_x)
    point_radius = (pi * line_radius) / (7 * (s.frontier_points - 1))
    line_start_x = s.padding + max(point_radius, s.frontier_stroke_size / 2)
    line_start_y = s.flip(line_start_x)
    line_radius  = s.flip(2 * line_start_x)
    path = Any[]
    push!(path, :M, line_start_x, line_start_y)
    push!(path, :A, line_radius, line_radius, 0, 0, 1, line_start_x + line_radius, line_start_y - line_radius)
    tag(IO, s, :path, [     :class              => vcat(classes, s.base - :line),
                            :d                  => path,
                            :stroke             => s.stroke_color,
                            :stroke - :width    => s.frontier_stroke_size,
                            :stroke - :linecap  => :round,
                            :style              => "fill:none" ] )
    comment(IO, s, "-- Frontier Points --")
    for angle in -90:(90 // (s.frontier_points - 1)):0
        x, y = circle_point(line_radius, angle)
        tag(IO, s, :circle, [   :class              => vcat(classes, s.base - :point),
                                :cx                 => line_start_x + line_radius + x,
                                :cy                 => line_start_y + y,
                                :r                  => point_radius,
                                :fill               => s.fill_color,
                                :style              => "stroke:none" ] )

    end
    end_g_svg(IO, s)
end

function correlation(s)
    IO = svg_title_g(s, :correlation, "Correlation Matrix")
    classes = [s.base, s.base - :correlation, s.base - :correlation - s.size, s.base - :accent - 1]
    n = s.square_cell_count
    x = floor((s.size - (n * s.square_cell_size + (n - 1) * s.square_cell_spacing)) / 2)
    y = x
    for i in 1:n
        y = s.padding
        for j in 1:n
            tag(IO, s, :polygon, [:class    => vcat(classes, s.base - :correlation - (1 + abs(i - j))),
                                  :points   => [x, y, x + s.square_cell_size, y, x + s.square_cell_size, y + s.square_cell_size, x, y + s.square_cell_size],
                                  :opacity  => 1 - abs(i - j) / n,
                                  :fill     => s.fill_color,
                                  :style    => "stroke:none" ] )
            y += s.square_cell_size + s.square_cell_spacing
        end
        x += s.square_cell_size + s.square_cell_spacing
    end
    end_g_svg(IO, s)
end

function bar(s)
    IO = svg_title_g(s, :bar, "Bar Chart")
    grid_lines(IO, s)
    comment(IO, s, "-- Columns --")
    classes = [s.base, s.base - :accent - 1, s.base - :bar, s.base - :bar - s.size]
    x = s.plot_x_origin
    y = s.plot_y_origin
    for (i, column_height) in enumerate(s.bar_column_heights)
        tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :bar -  i),
                              :points => [x, y, x + s.bar_column_width, y, x + s.bar_column_width, y - column_height, x, y - column_height],
                              :fill   => s.fill_color,
                              :style  => "stroke:none" ] )
        x += s.bar_column_width + s.bar_column_spacing
    end
    end_g_svg(IO, s)
end

function bar_u(s, label, title, option; values = [1.0 1.0; 1.0 1.0])
    IO = svg_title_g(s, label, title)
    grid_lines(IO, s)
    comment(IO, s, "-- " * string(option) * " Columns --")
    classes = [s.base, s.base - :bar, s.base - :bar - s.size]
    x = s.plot_x_origin
    y = s.plot_y_origin
    number_categories, number_series = size(values)
    bar_column_width = floor(.5 + s.plot_width / (number_categories * number_series * 1.25))
    series_spacing = ceil(bar_column_width / 8) # ceil(s.plot_width / 40)
    category_spacing = min(s.plot_width - number_categories * number_series * bar_column_width - 2 * series_spacing, bar_column_width, 3 * series_spacing)
    extra_space = s.plot_width - number_categories * number_series * bar_column_width - 2 * series_spacing - category_spacing
    x = s.plot_x_origin + ceil(extra_space / 2)

    if option == :Adjacent
        values = values ./ maximum(values)
    elseif option == :Percentage
        category_sums = sum(values, dims = 2)
        for category in 1:number_categories
            for series in 1:number_series
                values[category, series] /= category_sums[category]
            end
        end
    end
    if option != :Adjacent
        bar_column_width += bar_column_width + series_spacing
    end
    column_height = values .* s.plot_height
    for category in 1:number_categories
        y = s.plot_y_origin
        for series in 1:number_series
            tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :accent - (series - 1), s.base - :bar - series),
                                  :points => [x, y, x + bar_column_width, y, x + bar_column_width, y - column_height[category, series], x, y - column_height[category, series]],
                                  :fill   => s.fill_color,
                                  :style  => "stroke:none" ] )
            if option == :Adjacent
                x += bar_column_width + series_spacing
            else
                y -= column_height[category, series]
            end
        end
        if option == :Adjacent
            x += category_spacing - series_spacing
        else
            x += bar_column_width + category_spacing
        end
    end
    end_g_svg(IO, s)
end

bar_adjacent   = s -> bar_u(s, :bar - :adjacent  , "Adjacent Bar Chart"  , :Adjacent   ; values = [0.25 0.35; 0.60 0.40])
bar_stacked    = s -> bar_u(s, :bar - :stacked   , "Stacked Bar Chart"   , :Stacked    ; values = [0.25 0.35; 0.60 0.40])
bar_percentage = s -> bar_u(s, :bar - :percentage, "Percentage Bar Chart", :Percentage ; values = [0.25 0.35; 0.60 0.40])

function pdf(s, factor = 1.0)
    IO = svg_title_g(s, :pdf, "Probability Density Function Chart")
    grid_lines(IO, s)
    comment(IO, s, "-- PDF Polygon --")
    classes = [s.base, s.base - :pdf, s.base - :pdf - s.size, s.base - :accent - 1]
    r = 1 + 2 * s.plot_width
    h = s.plot_height * .95
    w = s.plot_width
    m = 1000
    sd = 3.0
    number_observations = m * (r - 1)
    d = repeat(sort!(randn(MersenneTwister(2), number_observations)), inner = 1)
    number_observations = length(d)
    xs = s.plot_x_origin .+ collect(0:w//r:w)
    ys = s.plot_y_origin .+ scale_to(Charts.pdf_Gaussian(d, std(d) * factor * 1.059 * number_observations^-.2, (-sd):(2 * sd / (r - 1)):sd, sorted = true), -h)
    d = Any[]
    for (i, (x, y)) in enumerate(zip(xs, ys))
        push!(d, i == 1 ? :M : :L)
        push!(d, x)
        push!(d, y)
    end
    tag(IO, s, :path, [:class   => classes,
                       :d       => d,
                       :fill    => s.fill_color,
                       :style  => "stroke:none" ] )
    end_g_svg(IO, s)
end

function cdf_u(s, label, title, option)
    IO = svg_title_g(s, label, title)
    grid_lines(IO, s)
    comment(IO, s, "-- CDF " * string(option) * " Plot --")
    classes = [s.base, s.base - :cdf, s.base - :cdf - s.size]
    n = option == :Stepped ? max(1, Int(floor(sqrt(s.size))) - 3) : 2 * s.plot_width
    adjustment = option == :Filled ? 0.0 : s.plot_stroke_size
    h =  Int(floor(s.plot_height   - adjustment))
    w =  Int(floor(s.plot_width    - adjustment))
    xo = Int(floor(s.plot_x_origin + adjustment / 2))
    yo = Int(floor(s.plot_y_origin - adjustment / 2))
    m = 1000
    sd = 3.0
    number_observations =   option == :Stepped ? 2 * m * n                           : 1 + m * n
    selected_observations = option == :Stepped ? (m:(2*m):(number_observations - m)) : 1:m:number_observations
    observations = clamp.(sort!(randn(MersenneTwister(2), number_observations))[selected_observations], -sd, sd)
    xs = xo .+ (w / (2 * sd)) .* (sd .+ observations)
    y  = 1.0 * yo
    d = Any[]
    push!(d, :M, xo, yo)
    for x in xs
        push!(d, :L, x, y)
        y -= h//n
        if option == :Stepped
            push!(d, :L, x, y)
        end
    end
    if option != :Smooth
        push!(d, :L, xo + w, y)
    end
    if option == :Filled
        push!(d, :L, xo + w, yo)
    end
    if option == :Filled
        tag(IO, s, :path, [:class               => vcat(classes, [s.base - :accent - 1]),
                           :d                   => d,
                           :fill                => s.fill_color,
                           :style              => "stroke:none" ] )
    else
        tag(IO, s, :path, [:class               => vcat(classes, [s.base - :fill, s.base - :accent - 1]),
                           :d                   => d,
                           :stroke              => s.fill_color,
                           :stroke - :width     => s.plot_stroke_size,
                           :stroke - :linecap   => (option == :Stepped ? :square : :round),
                           :stroke - :endcap    => (option == :Stepped ? :square : :round),
                           :style               => "fill:none" ] )
    end
    end_g_svg(IO, s)
end

cdf         = s -> cdf_u(s, :cdf           , "Cumulative Density Function Chart with Filled Plot" , :Filled)
cdf_stepped = s -> cdf_u(s, :cdf - :stepped, "Cumulative Density Function Chart with Stepped Plot", :Stepped)
cdf_smooth  = s -> cdf_u(s, :cdf - :smooth , "Cumulative Density Function Chart with Smooth Plot" , :Smooth )

function beeswarm(s)
    IO = svg_title_g(s, :beeswarm, "Beeswarm Chart")
    grid_lines(IO, s)
    comment(IO, s, "-- Beeswarm Circles --")
    classes = [s.base, s.base - :fill, s.base - :beeswarm, s.base - :beeswarm - s.size, s.base - :accent - 1]
    n = Int(floor(log2(s.size) - 2))
    rf = 0.8
    r = s.plot_width / (2 * n)
    h = s.plot_height
    w = s.plot_width
    y = s.plot_y_origin - rf * r
    for i in 1:n
        x = s.plot_x_origin + (i * r) - ((1 - rf) * r)
        for j in i:n
            tag(IO, s, :circle, [:class     => vcat(classes, s.base - :point),
                                 :cx        => x,
                                 :cy        => y,
                                 :r         => r * 0.8,
                                 :fill      => s.fill_color,
                                 :style     => "stroke:none"])
            x += 2 * r
        end
        y -= sqrt(3) * r
    end
    end_g_svg(IO, s)
end

function beeswarm_u(s, label, title, option)
    IO = svg_title_g(s, label, title)
    comment(IO, s, "-- Beeswarm " * string(option) * " --")
    grid_lines(IO, s)
    comment(IO, s, "-- Beeswarm Circles --")
    classes = [s.base, s.base - :fill, s.base - :beeswarm, s.base - :beeswarm - s.size]
    n = Int(floor(log2(s.size) - 2))
    r = s.plot_width / (option == :Separate ? 6 : 4)
    x = s.plot_x_origin + r
    y = s.plot_y_origin - r
    dx =  r * (option == :Separate ? 2 : 1)
    dy =  r * (option == :Separate ? -2 : option == :Overlap ? 0 : sqrt(3))
    for i in 1:3
        tag(IO, s, :circle, [:class     => vcat(classes, s.base - :accent - i, s.base - :point, s.base - :point - i),
                             :cx        => x,
                             :cy        => y,
                             :r         => r * 0.95,
                             :fill      => s.fill_color,
                             :opacity   => 0.7,
                             :style     => "stroke:none"])
        x += dx
        if option == :Mix
            dy *= -1
        end
        y += dy
    end
    end_g_svg(IO, s)
end

beeswarm_overlap  = s -> beeswarm_u(s, :beeswarm - :overlap ,  "Beeswarm Overlap" , :Overlap )
beeswarm_separate = s -> beeswarm_u(s, :beeswarm - :separate,  "Beeswarm Separate", :Separate)
beeswarm_mix      = s -> beeswarm_u(s, :beeswarm - :mix     ,  "Beeswarm Mix"     , :Mix     )

function scatter(s)
    IO = svg_title_g(s, :scatter, "Scatter Chart")
    grid_lines(IO, s)
    comment(IO, s, "-- Scatter Points --")
    classes = [s.base, s.base - :scatter, s.base - :scatter - s.size, s.base - :accent - 1]
    for (x,y) in zip(s.scatter_x , s.scatter_y)
        tag(IO, s, :circle, [:class     => vcat(classes, s.base - :point),
                             :cx        => s.plot_x_origin + x,
                             :cy        => s.plot_y_origin - y,
                             :r         => s.scatter_radius,
                             :fill      => s.fill_color,
                             :style     => "stroke:none"])
    end
    end_g_svg(IO, s)
end

function cone(s)
    IO = svg_title_g(s, :cone, "Cone Chart")
    grid_lines(IO, s)
    comment(IO, s, "-- Cone Polygons --")
    classes = [s.base, s.base - :cone, s.base - :cone - s.size]
    h = floor(s.plot_height / 2) / s.percentile_ranges
    point_x = s.plot_x_origin
    point_y = s.plot_y_origin - h * s.percentile_ranges
    right_x = point_x + s.plot_width
    for i in 1:s.percentile_ranges
        tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :accent - 2, s.base - :percentile - :up,   s.base - :percentile - (s.percentile_ranges - i + 1)),
                              :points => [point_x, point_y, right_x, point_y, right_x, point_y - i * h],
                              :opacity=> (1 - (i - 1) / s.percentile_ranges)^2,
                              :fill   => s.up_color,
                              :style  => "stroke:none" ] )
        tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :accent - 3, s.base - :percentile - :down, s.base - :percentile - (s.percentile_ranges - i + 1)),
                              :points => [point_x, point_y, right_x, point_y, right_x, point_y + i * h],
                              :opacity=> (1 - (i - 1) / s.percentile_ranges)^2,
                              :fill   => s.down_color,
                              :style  => "stroke:none" ] )

    end
    end_g_svg(IO, s)
end

function box(s; name = :box, shuffle = true)
    IO = svg_title_g(s, name, "Box Plot")
    grid_lines(IO, s)
    comment(IO, s, "-- Box Polygons --")
    classes = [s.base, s.base - name, s.base - name - s.size]
    permutation = collect(1:length(s.box_lower))
    shuffle && shuffle!(MersenneTwister(3), permutation)
    x = s.plot_x_origin
    for (i, (box_lower, box_upper)) in enumerate(zip(s.box_lower[permutation], s.box_upper[permutation]))
        r = box_upper - box_lower
        y = s.plot_y_origin - (box_upper + box_lower) / 2
        for j = 1:s.percentile_ranges
            f = (s.percentile_ranges - j + 1) / (2 * s.percentile_ranges)
            g = (j / s.percentile_ranges)^2
            tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :accent - 2, s.base - name - i, s.base - :percentile - :up  , s.base - :percentile - (s.percentile_ranges - j + 1)),
                                  :points => [x, y, x + s.bar_column_width, y, x + s.bar_column_width, y - r * f, x, y - r * f],
                                  :fill   => s.up_color,
                                  :opacity=> g,
                                  :style  => "stroke:none" ] )
            tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :accent - 3, s.base - :box - i, s.base - :percentile - :down, s.base - :percentile - (s.percentile_ranges - j + 1)),
                                  :points => [x, y, x + s.bar_column_width, y, x + s.bar_column_width, y + r * f, x, y + r * f],
                                  :fill   => s.down_color,
                                  :opacity=> g,
                                  :style  => "stroke:none" ] )
        end
        x += s.bar_column_width + s.bar_column_spacing
    end

    end_g_svg(IO, s)
end

box_ordered(s) = box(s; name = :box - :ordered, shuffle = false)

function histogram_normal(sd, buckets, n = 10000000)
    b = fill(0, buckets)
    ds = randn(n)
    for d in ds
        i = 1 + Int(floor((d+sd)*(buckets/(2*sd))))
        if i > 0 && i <= buckets
            b[i] += 1
        end
    end
    return b ./ maximum(b)
end

function histogram(s)
    IO = svg_title_g(s, :histogram, "Histogram")
    grid_lines(IO, s)
    comment(IO, s, "-- Histogram Columns --")
    classes = [s.base, s.base - :fill, s.base - :histogram, s.base - :histogram - s.size, s.base - :accent - 1]
    x = s.plot_x_origin
    y = s.plot_y_origin
    for (i, column_height) in enumerate(s.histogram_column_heights)
        tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :histogram -  i),
                              :points => [x, y, x + s.histogram_column_width, y, x + s.histogram_column_width, y - column_height, x, y - column_height],
                              :fill   => s.fill_color,
                              :style  => "stroke:none" ] )
        x += s.histogram_column_width + s.histogram_column_spacing
    end
    end_g_svg(IO, s)
end

function line(s)
    IO = svg_title_g(s, :line, "line")
    grid_lines(IO, s)
    comment(IO, s, "-- Line Segments --")
    classes = [s.base, s.base - :fill, s.base - :line, s.base - :line - s.size, s.base - :accent - 1]
    w = s.plot_width / s.bar_column_count
    xs = (s.plot_x_origin - w / 2) .+ w .* collect(1:s.bar_column_count)
    ys = s.plot_y_origin .- s.bar_column_heights
    for i in 2:length(xs)
        tag(IO, s, :line, [:class               => classes,
                           :x1                  => xs[i - 1],
                           :y1                  => ys[i - 1],
                           :x2                  => xs[i],
                           :y2                  => ys[i],
                           :stroke              => s.fill_color,
                           :stroke - :width     => s.plot_stroke_size,
                           :stroke - :linecap   => :round,
                           :style               => "fill:none" ] )
    end
    end_g_svg(IO, s)
end

function pivot(s)
    border_opacity = 1.0 # 0.275 # 1.0 # 0.175
    coordinate_opacity = 1.0 # 0.333 # 0.667
    IO = svg_title_g(s, :pivot, "Pivot")
    ((b, chh, rhw, dh, dw), (nr, nc)) =   s.size <= 16 ? ((s.size /  16) .* [ 1,  2,  3,  2,  3 ],  [3,  2]) :
                                          s.size <= 20 ? ((s.size /  20) .* [ 1,  2,  4,  3,  4 ],  [3,  2]) :
                                          s.size <= 24 ? ((s.size /  24) .* [ 1,  2,  6,  3,  5 ],  [4,  2]) :
                                          s.size <= 32 ? ((s.size /  32) .* [ 1,  5,  7,  4,  5 ],  [4,  3]) :
                                          s.size <= 48 ? ((s.size /  48) .* [ 2,  9, 10,  5,  7 ],  [4,  3]) :
                                          s.size <= 64 ? ((s.size /  64) .* [ 2,  6, 12,  7, 11 ],  [5,  3]) :
                                                         ((s.size / 128) .* [ 3, 10, 20, 11, 19 ],  [7,  4])
    classes = [s.base, s.base - :pivot, s.base - :pivot - s.size]
    comment(IO, s, "-- Column Axis Rectangle --")
    tag(IO, s, :rect, [ :class              => vcat(classes, [s.base - :accent - 0, s.base - :pivot - :axis]),
                        :x                  => b,
                        :y                  => b,
                        :width              => rhw + b + dh,
                        :height             => chh,
                        :fill               => s.fill_color,
                        :fill - :opacity    => 1.0,
                        :style              => "stroke:none" ] )
    comment(IO, s, "-- Row Axis Rectangle --")
    tag(IO, s, :rect, [ :class              => vcat(classes, [s.base - :accent - 0, s.base - :pivot - :axis]),
                        :x                  => b,
                        :y                  => b + chh + b,
                        :width              => rhw,
                        :height             => dh,
                        :fill               => s.fill_color,
                        :fill - :opacity    => 1.0,
                        :style              => "stroke:none" ] )
    comment(IO, s, "-- Column Coordinate Rectangles --")
    y = b
    for x in (b + rhw + b + dh + b) .+ (dw + b) .* (0:(nc - 1))
        tag(IO, s, :rect, [ :class              => vcat(classes, [s.base - :accent - 1, s.base - :pivot - :coordinate]),
                            :x                  => x,
                            :y                  => y,
                            :width              => dw,
                            :height             => chh,
                            :fill               => s.fill_color,
                            :fill - :opacity    => coordinate_opacity,
                            :style              => "stroke:none" ] )
    end
    comment(IO, s, "-- Row Coordinate Rectangles --")
    x = b
    for y in (b + chh + b + dh + b) .+ (dh + b) .* (0:(nr - 1))
        tag(IO, s, :rect, [ :class              => vcat(classes, [s.base - :accent - 1, s.base - :pivot - :coordinate]),
                            :x                  => x,
                            :y                  => y,
                            :width              => rhw,
                            :height             => dh,
                            :fill               => s.fill_color,
                            :fill - :opacity    => coordinate_opacity,
                            :style              => "stroke:none" ] )
    end
    comment(IO, s, "-- Top Border --")
    tag(IO, s, :line, [ :class              => vcat(classes, s.base - :border),
                        :x1                 => b,
                        :y1                 => b / 2,
                        :x2                 => s.size,
                        :y2                 => b / 2,
                        :stroke             => s.stroke_color,
                        :stroke - :width    => b,
                        :stroke - :opacity  => border_opacity,
                        :stroke - :endcap   => :butt,
                        :style              => "fill:none" ] )
    comment(IO, s, "-- Borders Above and Below Row Axis and Coordinates --")
    for y in b + (b / 2 + chh) .+ (dh + b) .* (0:(nr + 1))
        tag(IO, s, :line, [ :class              => vcat(classes, s.base - :border),
                            :x1                 => b,
                            :y1                 => y,
                            :x2                 => b + rhw,
                            :y2                 => y,
                            :stroke             => s.stroke_color,
                            :stroke - :width    => b,
                            :stroke - :opacity  => border_opacity,
                            :stroke - :endcap   => :butt,
                            :style              => "fill:none" ] )
    end
    comment(IO, s, "-- Left Border --")
    tag(IO, s, :line, [ :class              => vcat(classes, s.base - :border),
                        :x1                 => b / 2,
                        :y1                 => 0,
                        :x2                 => b / 2,
                        :y2                 => s.size,
                        :stroke             => s.stroke_color,
                        :stroke - :width    => b,
                        :stroke - :opacity  => border_opacity,
                        :stroke - :endcap   => :butt,
                        :style              => "fill:none" ] )
    comment(IO, s, "-- Borders Left and Right of Column Axis and Coordinates --")
    for x in (rhw + b * 2.5 + dh) .+ (dw + b) .* (0:nc)
        tag(IO, s, :line, [ :class              => vcat(classes, s.base - :border),
                            :x1                 => x,
                            :y1                 => b,
                            :x2                 => x,
                            :y2                 => b + chh,
                            :stroke             => s.stroke_color,
                            :stroke - :width    => b,
                            :stroke - :opacity  => border_opacity,
                            :stroke - :endcap   => :butt,
                            :style              => "fill:none" ] )
    end
    comment(IO, s, "-- Thick Right Angle Border Area --")
    tag(IO, s, :polygon, [:class  => vcat(classes, s.base - :stroke, s.base - :border),
                          :points => [b + rhw, b + chh, s.size, b + chh, s.size, 3 * b + chh + dh, 3 * b + rhw + dh, 3 * b + chh + dh, 3 * b + rhw + dh, s.size, b + rhw, s.size],
                          :fill   => s.stroke_color,
                          :opacity=> border_opacity,
                          :style  => "stroke:none" ] )
    comment(IO, s, "-- Data Grid Borders --")
    for x in (2.5 * b + rhw + dh) .+ ((dw + b) .* (0:(nc - 1)))
        for y in (2.5 * b + chh + dh) .+ ((dh + b) .* (0:(nr - 1)))
            tag(IO, s, :line, [ :class              => vcat(classes, s.base - :border),
                                :x1                 => x + b / 2,
                                :y1                 => y + dh + b,
                                :x2                 => x + dw + b * 1.5,
                                :y2                 => y + dh + b,
                                :stroke             => s.stroke_color,
                                :stroke - :width    => b,
                                :stroke - :opacity  => border_opacity,
                                :stroke - :endcap   => :butt,
                                :style              => "fill:none" ] )
            tag(IO, s, :line, [ :class              => vcat(classes, s.base - :border),
                                :x1                 => x + dw + b,
                                :y1                 => y + b / 2,
                                :x2                 => x + dw + b,
                                :y2                 => y + dh + b / 2,
                                :stroke             => s.stroke_color,
                                :stroke - :width    => b,
                                :stroke - :opacity  => border_opacity,
                                :stroke - :endcap   => :butt,
                                :style              => "fill:none" ] )
        end
    end
    end_g_svg(IO, s)
end

function axes2columns(s)
    IO = svg_title_g(s, :axes2columns, "Axes to Columns")
    classes             = [s.base, s.base - :axes2columns, s.base - :axes2columns - s.size]
    spacing             = Int(floor(log(8, s.size)))
    number_row_axes     = Int(ceil(log(5, s.size)))
    axis_width          = floor((s.size + spacing) / (number_row_axes + 1)) - spacing
    axis_height         = floor(.75 * axis_width)
    number_column_axes  = floor((s.size + spacing) / (axis_height + spacing)) - (number_row_axes + 1)
    column_x            = s.size - axis_width
    column_y            = s.size - ((number_row_axes + number_column_axes + 1) * axis_height + (number_row_axes + number_column_axes) * spacing)
    row_x               = s.size - ((number_row_axes + 1) * axis_width + number_row_axes * spacing)
    row_y               = s.size - axis_height
    dur = "0.5s"
    comment(IO, s, "-- Existing Column Axes --")
    for i in 1:number_column_axes
        begintag(IO, s, :rect, [:class              => vcat(classes, [s.base - :accent - 0]),
                                :x                  => column_x,
                                :y                  => column_y,
                                :width              => axis_width,
                                :height             => axis_height,
                                :fill               => s.fill_color,
                                :fill - :opacity    => 1.0,
                                :style              => "stroke:none" ] )
            begintag(IO, s, :animateMotion, [   :dur    => dur,
                                                :path   => [:M, 0, (number_row_axes * (axis_height + spacing)), :L, 0, 0],
                                                :begin  => string("axes2columns", s.size, "foregroundrectangle", ".mouseover") ])
            endtag(IO, s, :animateMotion)
        endtag(IO, s, :rect)

        column_y += (axis_height + spacing)
    end
    comment(IO, s, "-- Existing Row Axes --")
    for i in 1:number_row_axes
        begintag(IO, s, :rect, [:class              => vcat(classes, [s.base - :accent - 0]),
                                :x                  => column_x,
                                :y                  => column_y,
                                :width              => axis_width,
                                :height             => axis_height,
                                :fill               => s.fill_color,
                                :fill - :opacity    => 1.0,
                                :style              => "stroke:none" ] )
            begintag(IO, s, :animateMotion, [:dur   => dur,
                                             :path  => [:M, row_x - column_x, row_y - column_y, :Q, row_x - column_x, 0, 0, 0],
                                             :begin => string("axes2columns", s.size, "foregroundrectangle", ".mouseover") ])

            endtag(IO, s, :animateMotion)
        endtag(IO, s, :rect)
        column_y += (axis_height + spacing)
        row_x += (axis_width + spacing)
    end
    endtag(IO, s, :g)
    comment(IO, s, "-- Curved Arrow --")
    arrow_radius        = 0.85 * (s.size - max(axis_width, axis_height))
    center_x            = s.size - axis_width
    center_y            = s.size - axis_height
    begintag(IO, s, :g, [:data - :width  => arrow_radius,
                         :data - :height => arrow_radius ])
        begintag(IO, s, :g, [:data - :width  => arrow_radius,
                             :data - :height => arrow_radius,
                             :transform      => "translate(" * string(center_x) * ", "  * string(center_y) * ")" ])
            tag(IO, s, :path, [     :class              => vcat(classes, s.base - :stroke, s.base - :arrow),
                                    :d                  => curved_arrow(270, 360, arrow_radius, counterclockwise_head = false),
                                    :fill               => s.stroke_color,
                                    :style              => "stroke:none" ] )
        endtag(IO, s, :g)
        tag(IO, s, :animateTransform, [ :attributeName  => :transform,
                                        :dur            => dur,
                                        :type           => :rotate,
                                        :from           => [-180, center_x, center_y],
                                        :to             => [   0, center_x, center_y],
                                        :begin          => string("axes2columns", s.size, "foregroundrectangle", ".mouseover") ])

    endtag(IO, s, :g)
    comment(IO, s, "-- Foreground Rectangle (transparent, for mouseover event only) --")
    tag(IO, s, :rect, [:class              => vcat(classes, [s.base - :bg]),
                       :x                  => 0,
                       :y                  => 0,
                       :width              => s.size,
                       :height             => s.size,
                       :fill               => s.background_color,
                       :id                 => string("axes2columns", s.size, "foregroundrectangle"),
                       :style              => "stroke:none; fill-opacity:0" ] )
    endtag(IO, s, :svg)
    close(IO)
end

function axes2rows(s)
    IO = svg_title_g(s, :axes2rows, "Axes to Rows")
    classes             = [s.base, s.base - :axes2rows, s.base - :axes2rows - s.size]
    spacing             = Int(floor(log(8, s.size)))
    number_row_axes     = Int(ceil(log(5, s.size)))
    axis_width          = floor((s.size + spacing) / (number_row_axes + 1)) - spacing
    axis_height         = floor(.75 * axis_width)
    number_column_axes  = number_row_axes - 1
    number_row_axes     = 1
    row_y               = s.size - axis_height
    row_x               = s.size - ((number_row_axes + number_column_axes + 1) * axis_width + (number_row_axes + number_column_axes) * spacing)
    column_y            = s.size - ((number_column_axes + 1) * axis_height + number_column_axes * spacing)
    column_x            = s.size - axis_width
    dur = "0.5s"
    comment(IO, s, "-- Existing Row Axes --")
    for i in 1:number_row_axes
        begintag(IO, s, :rect, [:class              => vcat(classes, [s.base - :accent - 0]),
                                :x                  => row_x,
                                :y                  => row_y,
                                :width              => axis_width,
                                :height             => axis_height,
                                :fill               => s.fill_color,
                                :fill - :opacity    => 1.0,
                                :style              => "stroke:none" ] )
            begintag(IO, s, :animateMotion, [   :dur    => dur,
                                                :path   => [:M, (number_column_axes * (axis_width + spacing)), 0, :L, 0, 0],
                                                :begin  => string("axes2rows", s.size, "foregroundrectangle", ".mouseover") ])
            endtag(IO, s, :animateMotion)
        endtag(IO, s, :rect)
        row_x += (axis_width + spacing)
    end
    comment(IO, s, "-- Existing Column Axes --")
    for i in 1:number_column_axes
        begintag(IO, s, :rect, [:class              => vcat(classes, [s.base - :accent - 0]),
                                :x                  => row_x,
                                :y                  => row_y,
                                :width              => axis_width,
                                :height             => axis_height,
                                :fill               => s.fill_color,
                                :fill - :opacity    => 1.0,
                                :style              => "stroke:none" ] )
            begintag(IO, s, :animateMotion, [:dur   => dur,
                                             :path  => [:M, column_x - row_x, column_y - row_y, :Q, 0, column_y - row_y, 0, 0, 0],
                                             :begin => string("axes2rows", s.size, "foregroundrectangle", ".mouseover") ])

            endtag(IO, s, :animateMotion)
        endtag(IO, s, :rect)
        row_x += (axis_width + spacing)
        column_y += (axis_height + spacing)
    end
    endtag(IO, s, :g)
    comment(IO, s, "-- Curved Arrow --")
    arrow_radius        = 0.85 * (s.size - max(axis_width, axis_height))
    center_x            = s.size - axis_width
    center_y            = s.size - axis_height
    begintag(IO, s, :g, [:data - :width  => arrow_radius,
                         :data - :height => arrow_radius ])
        begintag(IO, s, :g, [:data - :width  => arrow_radius,
                             :data - :height => arrow_radius,
                             :transform      => "translate(" * string(center_x) * ", "  * string(center_y) * ")" ])
            tag(IO, s, :path, [     :class              => vcat(classes, s.base - :stroke, s.base - :arrow),
                                    :d                  => curved_arrow(270, 360, arrow_radius, clockwise_head = false),
                                    :fill               => s.stroke_color,
                                    :style              => "stroke:none" ] )
        endtag(IO, s, :g)
        tag(IO, s, :animateTransform, [ :attributeName  => :transform,
                                        :dur            => dur,
                                        :type           => :rotate,
                                        :from           => [ 180, center_x, center_y],
                                        :to             => [   0, center_x, center_y],
                                        :begin          => string("axes2rows", s.size, "foregroundrectangle", ".mouseover") ])
        comment(IO, s, "-- Foreground Rectangle (transparent, for mouseover event only) --")

    endtag(IO, s, :g)
    tag(IO, s, :rect, [:class              => vcat(classes, [s.base - :bg]),
                   :x                  => 0,
                   :y                  => 0,
                   :width              => s.size,
                   :height             => s.size,
                   :fill               => s.background_color,
                   :id                 => string("axes2rows", s.size, "foregroundrectangle"),
                   :style              => "stroke:none; fill-opacity:0" ] )
    endtag(IO, s, :svg)
    close(IO)
end

function axes_flip(s)
    IO = svg_title_g(s, :axes - :flip, "Axes Flip")
    classes             = [s.base, s.base - :axes - :flip, s.base - :axes - :flip - s.size]
    spacing             = Int(floor(log(8, s.size)))
    number_row_axes     = Int(ceil(log(5, s.size)))
    axis_width          = floor((s.size + spacing) / (number_row_axes + 1)) - spacing
    axis_height         = floor(.75 * axis_width)
    number_column_axes  = number_row_axes
    row_y               = s.size - axis_height
    row_x               = s.size - ((number_row_axes + 1) * axis_width + (number_row_axes) * spacing)
    column_y            = s.size - ((number_column_axes + 1) * axis_height + number_column_axes * spacing)
    column_x            = s.size - axis_width
    dur = "0.5s"
    comment(IO, s, "-- Axes --")
    for i in 1:number_column_axes
        begintag(IO, s, :rect, [:class              => vcat(classes, [s.base - :accent - 0]),
                                :x                  => row_x,
                                :y                  => row_y,
                                :width              => axis_width,
                                :height             => axis_height,
                                :fill               => s.fill_color,
                                :fill - :opacity    => 1.0,
                                :style              => "stroke:none" ] )
            begintag(IO, s, :animateMotion, [:dur   => dur,
                                             :path  => [:M, column_x - row_x, column_y - row_y, :Q, column_x - row_x, column_y - row_y, 0, 0, 0],
                                             :begin => string("axesflip", s.size, "foregroundrectangle", ".mouseover") ])

            endtag(IO, s, :animateMotion)
        endtag(IO, s, :rect)

        begintag(IO, s, :rect, [:class              => vcat(classes, [s.base - :accent - 0]),
                                :x                  => column_x,
                                :y                  => column_y,
                                :width              => axis_width,
                                :height             => axis_height,
                                :fill               => s.fill_color,
                                :fill - :opacity    => 1.0,
                                :style              => "stroke:none" ] )
            begintag(IO, s, :animateMotion, [:dur   => dur,
                                             :path  => [:M, row_x - column_x, row_y - column_y, :Q, row_x - column_x, row_y - column_y, 0, 0, 0],
                                             :begin => string("axesflip", s.size, "foregroundrectangle", ".mouseover") ])

            endtag(IO, s, :animateMotion)
        endtag(IO, s, :rect)

        row_x += (axis_width + spacing)
        column_y += (axis_height + spacing)
    end
    endtag(IO, s, :g)
    comment(IO, s, "-- Curved Arrow --")
    arrow_radius        = 0.85 * (s.size - max(axis_width, axis_height))
    center_x            = s.size - axis_width
    center_y            = s.size - axis_height
    begintag(IO, s, :g, [:data - :width  => arrow_radius,
                         :data - :height => arrow_radius ])
        begintag(IO, s, :g, [:data - :width  => arrow_radius,
                             :data - :height => arrow_radius,
                             :transform      => "translate(" * string(center_x) * ", "  * string(center_y) * ")" ])
            tag(IO, s, :path, [     :class              => vcat(classes, s.base - :stroke, s.base - :arrow),
                                    :d                  => curved_arrow(270, 315, arrow_radius, clockwise_head = false),
                                    :fill               => s.stroke_color,
                                    :style              => "stroke:none" ] )
        endtag(IO, s, :g)
        tag(IO, s, :animateTransform, [ :attributeName  => :transform,
                                        :dur            => dur,
                                        :type           => :rotate,
                                        :from           => [ 180, center_x, center_y],
                                        :to             => [   0, center_x, center_y],
                                        :begin          => string("axesflip", s.size, "foregroundrectangle", ".mouseover") ])
        comment(IO, s, "-- Foreground Rectangle (transparent, for mouseover event only) --")
    endtag(IO, s, :g)
    begintag(IO, s, :g, [:data - :width  => arrow_radius,
                         :data - :height => arrow_radius ])
        begintag(IO, s, :g, [:data - :width  => arrow_radius,
                             :data - :height => arrow_radius,
                             :transform      => "translate(" * string(center_x) * ", "  * string(center_y) * ")" ])
            tag(IO, s, :path, [     :class              => vcat(classes, s.base - :stroke, s.base - :arrow),
                                    :d                  => curved_arrow(315, 360, arrow_radius, counterclockwise_head = false),
                                    :fill               => s.stroke_color,
                                    :style              => "stroke:none" ] )
        endtag(IO, s, :g)
        tag(IO, s, :animateTransform, [ :attributeName  => :transform,
                                        :dur            => dur,
                                        :type           => :rotate,
                                        :from           => [-180, center_x, center_y],
                                        :to             => [   0, center_x, center_y],
                                        :begin          => string("axesflip", s.size, "foregroundrectangle", ".mouseover") ])
        comment(IO, s, "-- Foreground Rectangle (transparent, for mouseover event only) --")
    endtag(IO, s, :g)

    tag(IO, s, :rect, [:class              => vcat(classes, [s.base - :bg]),
                   :x                  => 0,
                   :y                  => 0,
                   :width              => s.size,
                   :height             => s.size,
                   :fill               => s.background_color,
                   :id                 => string("axesflip", s.size, "foregroundrectangle"),
                   :style              => "stroke:none; fill-opacity:0" ] )
    endtag(IO, s, :svg)
    close(IO)
end

function singular_axes(s)
    IO = svg_title_g(s, :singular - :axes, "Singular Axes")
    classes             = String[]
    spacing             = Int(floor(log(8, s.size)))
    number_rows         = Int(ceil(log(5, s.size)))
    rectangle_width     = float(floor(6//16 * s.size))
    rectangle_height    = float(floor(4//16 * s.size))
    spacing             = float(floor(2//16 * s.size))
    radius              = s.size / 32
    stroke_width        = s.size / 24
    dash_length         = 1/10 * s.size
    number_rows         = floor((s.size + spacing) / (rectangle_height + spacing))
    y                   = floor(s.size / (number_rows * rectangle_height + (number_rows - 1) * spacing) / 2)
    comment(IO, s, "-- Singular Axes (Axis, Colon, Coordinate) --")
    for i in 1:number_rows
        tag(IO, s, :rect,   [:class   => vcat(classes, [s.base - :accent - 0]),
                             :x       => 0,
                             :y       => y,
                             :width   => rectangle_width,
                             :height  => rectangle_height,
                             :fill    => s.fill_color,
                             :style   => "stroke:none" ] )
        tag(IO, s, :line,   [:stroke             => s.stroke_color,
                             :stroke - :width    => stroke_width,
                             :stroke - :linecap  => :round,
                             :class              => vcat(classes, [s.base - :equal - :sign]),
                             :x1                 => s.size / 2 - dash_length / 2,
                             :y1                 => y + rectangle_height / 2 - stroke_width,
                             :x2                 => s.size / 2 + dash_length / 2,
                             :y2                 => y + rectangle_height / 2 - stroke_width ])

        tag(IO, s, :line,   [:stroke             => s.stroke_color,
                             :stroke - :width    => stroke_width,
                             :stroke - :linecap  => :round,
                             :class              => vcat(classes, [s.base - :equal - :sign]),
                             :x1                 => s.size / 2 - dash_length / 2,
                             :y1                 => y + rectangle_height / 2 + stroke_width,
                             :x2                 => s.size / 2 + dash_length / 2,
                             :y2                 => y + rectangle_height / 2 + stroke_width ])

        #=
        tag(IO, s, :circle, [:class   => vcat(classes, [s.base - :stroke]),
                             :cx      => s.size / 2,
                             :cy      => y + 1/4 * rectangle_height,
                             :r       => spacing / 4,
                             :fill    => s.stroke_color,
                             :style   => "stroke:none" ] )
        tag(IO, s, :circle, [:class   => vcat(classes, [s.base - :stroke]),
                             :cx      => s.size / 2,
                             :cy      => y + 3/4 * rectangle_height,
                             :r       => spacing / 4,
                             :fill    => s.stroke_color,
                             :style   => "stroke:none" ] )
        =#
        tag(IO, s, :rect,   [:class   => vcat(classes, [s.base - :accent - 1]),
                             :x       => s.size - rectangle_width,
                             :y       => y,
                             :width   => rectangle_width,
                             :height  => rectangle_height,
                             :fill    => s.fill_color,
                             :style   => "stroke:none" ] )
        y += rectangle_height + spacing
    end
    endtag(IO, s, :g)
    endtag(IO, s, :svg)
    close(IO)
end

function report_u(s, label, title, option)
    IO = svg_title_g(s, label, title)
    comment(IO, s, "-- Report " * string(option) * " --")
    classes = [s.base, s.base - :report, s.base - :report - s.size]
    report_width = s.size - 2
    number_holes = Int(floor(sqrt(report_width))) - 1
    left_right_margin = 0.05 * report_width
    hole_group_width = (report_width - 2 * left_right_margin) / number_holes
    hole_radius = 0.30 * hole_group_width
    channel_width = 1.00 * hole_radius
    channel_height = hole_radius * 1.0
    ring_width = 0.5 * channel_width
    binding_offset = hole_radius * 1.5 + ring_width / 2
    report_height = Int(floor(min(.80 * report_width, s.size - binding_offset)))
    page_x_origin = (s.size - report_width) / 2
    page_y_origin = Int(max(floor((s.size - report_height) / 2), ceil(binding_offset)))
    x = page_x_origin
    y = page_y_origin
    d = Any[]
    push!(d, :M, x, y)
    push!(d, :L, x += left_right_margin, y)
    for i in 1:number_holes
        push!(d, :L, x += (hole_group_width - channel_width) / 2, y)
        push!(d, :L, x, y += channel_height)
        push!(d, :A, hole_radius, hole_radius, 0, 1, 0, x += channel_width, y)
        push!(d, :L, x, y -= channel_height)
        push!(d, :L, x += (hole_group_width - channel_width) / 2, y)
    end
    push!(d, :L, x += left_right_margin, y)
    push!(d, :L, x, y += option == :Page ? (channel_height + 2 * hole_radius + left_right_margin) : report_height)
    push!(d, :L, page_x_origin, y)
    push!(d, :L, page_x_origin, page_y_origin)
    tag(IO, s, :path, [:class               => vcat(classes, [s.base - :accent - 1, s.base - :report - :cover]),
                       :d                   => d,
                       :fill                => s.fill_color,
                       :style               => "stroke:none" ] )
    if option == :Page
        d = Any[]
        page_y_origin += channel_height + 2 * hole_radius + left_right_margin
        report_height -= channel_height + 2 * hole_radius + left_right_margin
        y = page_y_origin
        x = page_x_origin
        push!(d, :M, x    , y    )
        push!(d, :v, report_height)
        push!(d, :h, report_width)
        push!(d, :v, -report_height)
        push!(d, :h, -left_right_margin)
        push!(d, :v, report_height - left_right_margin)
        push!(d, :h, -(report_width - 2 * left_right_margin))
        push!(d, :v, -(report_height - left_right_margin))
        push!(d, :h, -left_right_margin)
        tag(IO, s, :path, [:class               => vcat(classes, [s.base - :accent - 1, s.base - :report - :page - :border]),
                           :d                   => d,
                           :fill                => s.fill_color,
                           :style               => "stroke:none" ] )

    end
    if option == :Cover
        comment(IO, s, "-- Report Binding --")
        x = page_x_origin + left_right_margin + hole_group_width / 2
        y = page_y_origin - binding_offset + ring_width / 2
        for i in 1:number_holes
            tag(IO, s, :line, [:class               => vcat(classes, [s.base - :report - :binding]),
                               :x1                  => x,
                               :y1                  => y,
                               :x2                  => x,
                               :y2                  => y + binding_offset + channel_height + hole_radius - ring_width,
                               :stroke              => s.stroke_color,
                               :stroke - :width     => ring_width,
                               :stroke - :linecap   => :round,
                               :style               => "fill:none" ])
            x += hole_group_width
        end
    end
    end_g_svg(IO, s)
end

report_cover = s -> report_u(s, :report - :cover,  "Report Cover" , :Cover)
report_page  = s -> report_u(s, :report - :page ,  "Report Page"  , :Page)

function roulette(s)
    IO = svg_title_g(s, :roulette, "Roulette Wheel")
    slot_outer_radius = 0.48 * s.size
    slot_inner_radius = 0.24 * s.size
    number_slots = 2 + 4 * Int(floor(sqrt(s.size) / 2))
    slot_offset = 360 / number_slots
    slot_angle = slot_offset * .75
    outer_x = sind(slot_angle) * slot_outer_radius
    inner_x = sind(slot_angle) * slot_inner_radius
    outer_y = cosd(slot_angle) * slot_outer_radius
    inner_y = cosd(slot_angle) * slot_inner_radius
    classes = [s.base, s.base - :roulette, s.base - :roulette - s.size]
    begintag(IO, s, :g, [:data - :width  => s.size,
                         :data - :height => s.size,
                         :transform      => "translate(" * (string(s.size / 2)) * " " * (string(s.size / 2)) * ")" ])
        comment(IO, s, "-- Background Circle --")
        tag(IO, s, :circle, [:class             => [s.base - :bg, s.base - :roulette - :bg],
                             :fill              => s.background_color,
                             :fill - :opacity   => 0.5,
                             :r                 => s.size / 2,
                             :style             => "stroke:none" ])
        comment(IO, s, "-- Slots --")
        alternating_slot_flag = true
        fill_colors = ["rgb(0,255,0)", "rgb(255,0,0)", "rgb(0,0,0)"]
        fill_slot_classes = [:green, :red, :black]
        for i in 1:number_slots
            slot_type_index = 0 == rem(i, Int(number_slots / 2)) ? 1 : 2 + (alternating_slot_flag = !alternating_slot_flag)
            begintag(IO, s, :g, [:data - :width  => s.size,
                                 :data - :height => s.size,
                                 :transform      => "rotate(" * (string(i * slot_offset - 0.5 * slot_angle)) * ")" ])
                tag(IO, s, :path, [     :class              => vcat(classes, s.base - :roulette - :slot - fill_slot_classes[slot_type_index]),
                                        :d                  => [:M, 0, -slot_inner_radius, :V, -slot_outer_radius, :A, slot_outer_radius, slot_outer_radius, 0, 0, 1, outer_x, -outer_y, :L, inner_x, -inner_y],
                                        :fill               => fill_colors[slot_type_index],
                                        :style              => "stroke:none" ] )
            endtag(IO, s, :g)
        end
        comment(IO, s, "-- Center --")
        far_point = 0.6 * slot_inner_radius
        close_point = 0.2 * slot_inner_radius

        tag(IO, s, :path, [     :class              => vcat(classes, s.base - :stroke, s.base - :roulette - :center),
                                :d                  => [:M, 0, far_point, :L, close_point, close_point, :L, far_point, 0, :L, close_point, -close_point, :L, 0, -far_point, :L, -close_point, -close_point, :L, -far_point, 0, :L, -close_point, close_point, :L, 0, far_point],
                                :fill               => s.stroke_color,
                                :style              => "stroke:none" ] )
        comment(IO, s, "-- Foreground Circle (transparent for mouseover event only)--")
        tag(IO, s, :circle, [:class             => [s.base - :fg, s.base - :roulette - :fg],
                             :fill              => s.background_color,
                             :r                 => s.size / 2,
                             :style             => "stroke:none; fill-opacity:0",
                             :id                => string("roulette", s.size, :circle) ])
    endtag(IO, s, :g)
    tag(IO, s, :animateTransform, [ :attributeName  => :transform,
                                    :dur            => "0.5s",
                                    :type           => :rotate,
                                    :from           => [0, s.size / 2, s.size / 2],
                                    :to             => [180, s.size / 2, s.size / 2],
                                    :begin          => string("roulette", s.size, :circle, ".mouseover") ])
    endtag(IO, s, :g)
    endtag(IO, s, :svg)
    close(IO)
end

function circle_point(radius, angle)
    angle, x_factor, y_factor = angle <  90 ? (      angle,  1,  1) :
                                angle < 180 ? (180 - angle,  1, -1) :
                                angle < 270 ? (angle - 180, -1, -1) :
                                              (360 - angle, -1,  1)
    return radius * x_factor * sind(angle), radius * -1 * y_factor * cosd(angle)
end

function curved_arrow(begin_angle,
                      end_angle,
                      outer_radius,
                      line_thickness = 0.15 * outer_radius,
                      arrow_head_extension = .75 * line_thickness,
                      arrow_head_angle = atand((line_thickness + 2 * arrow_head_extension) / (outer_radius - arrow_head_extension - line_thickness / 2));
                      clockwise_head = true,
                      counterclockwise_head = true)
    line_outer_radius = outer_radius - arrow_head_extension
    line_inner_radius = line_outer_radius - line_thickness
    arrow_head_radius = line_inner_radius + line_thickness / 2
    path = Any[]
    if counterclockwise_head
        push!(path, :M,                                                circle_point(line_inner_radius                       , begin_angle + arrow_head_angle)...)
        push!(path, :L,                                                circle_point(line_inner_radius - arrow_head_extension, begin_angle + arrow_head_angle)...)
        push!(path, :A, line_inner_radius, line_inner_radius, 0, 0, 0, circle_point(arrow_head_radius                       , begin_angle                   )...)
        push!(path, :A, line_outer_radius, line_outer_radius, 0, 0, 1, circle_point(line_outer_radius + arrow_head_extension, begin_angle + arrow_head_angle)...)
        push!(path, :L,                                                circle_point(line_outer_radius                       , begin_angle + arrow_head_angle)...)
    else
        push!(path, :M,                                                circle_point(line_inner_radius                       , begin_angle                   )...)
        push!(path, :L,                                                circle_point(line_outer_radius                       , begin_angle                   )...)
    end
    if clockwise_head
        push!(path, :A, line_outer_radius, line_outer_radius, 0, 0, 1, circle_point(line_outer_radius                       , end_angle - arrow_head_angle  )...)
        push!(path, :L,                                                circle_point(line_outer_radius + arrow_head_extension, end_angle - arrow_head_angle  )...)
        push!(path, :A, line_outer_radius, line_outer_radius, 0, 0, 1, circle_point(arrow_head_radius                       , end_angle                     )...)
        push!(path, :A, line_inner_radius, line_inner_radius, 0, 0, 0, circle_point(line_inner_radius - arrow_head_extension, end_angle - arrow_head_angle  )...)
        push!(path, :L,                                                circle_point(line_inner_radius                       , end_angle - arrow_head_angle  )...)
    else
        push!(path, :A, line_outer_radius, line_outer_radius, 0, 0, 1, circle_point(line_outer_radius                       , end_angle                     )...)
        push!(path, :L,                                                circle_point(line_inner_radius                       , end_angle                     )...)
    end
    push!(    path, :A, line_inner_radius, line_inner_radius, 0, 0, 0, circle_point(line_inner_radius                       , begin_angle + (counterclockwise_head ? arrow_head_angle : 0))...)
    return path
end

function arrow(s)
    IO = svg_title_g(s, :arrow, "Arrow")
    classes = [s.base, s.base - :arrow]
    begintag(IO, s, :g, [:data - :width  => s.size,
                         :data - :height => s.size,
                         :transform      => "translate(" * string(s.size) * ", " * string(s.size) * ")" ])
        tag(IO, s, :path, [     :class              => vcat(classes, s.base - :stroke),
                                :d                  => curved_arrow(270, 360, s.size, counterclockwise_head = false),
                                :fill               => s.stroke_color,
                                :style              => "stroke:none" ] )
    endtag(IO, s, :g)

#=
    begintag(IO, s, :g, [:data - :width  => s.size,
                         :data - :height => s.size,
                         :transform      => "translate(" * string(s.size / 2) * ", " * string(s.size / 2) * ")" ])
        tag(IO, s, :path, [     :class              => classes,
                                :d                  => curved_arrow(90, 270, s.size / 2),
                                :fill               => s.fill_color,
                                :style              => "stroke:none" ] )
    endtag(IO, s, :g)

    begintag(IO, s, :g, [:data - :width  => s.size,
                         :data - :height => s.size,
                         :transform      => "translate(" * string(s.size / 2) * ", " * string(s.size / 2) * ")" ])
        tag(IO, s, :path, [     :class              => classes,
                                :d                  => curved_arrow(270, 315, s.size / 2; counterclockwise_head = false),
                                :fill               => s.fill_color,
                                :style              => "stroke:none" ] )
    endtag(IO, s, :g)

    begintag(IO, s, :g, [:data - :width  => s.size,
                         :data - :height => s.size,
                         :transform      => "translate(" * string(s.size / 2) * ", " * string(s.size / 2) * ")" ])
        tag(IO, s, :path, [     :class              => classes,
                                :d                  => curved_arrow(315, 360, s.size / 2; clockwise_head = false),
                                :fill               => s.fill_color,
                                :style              => "stroke:none" ] )
    endtag(IO, s, :g)
=#

    endtag(IO, s, :g)
    endtag(IO, s, :svg)
    close(IO)
end

function io_monitor(s)
    IO = svg_title_g(s, :io - :monitor, "IO Monitor")
    comment(IO, s, "-- Lambda Character --")
    classes = [s.base, s.base - :io - :monitor, s.base - :io - :monitor - s.size]
    xs = [10, 12,  7,  9, 13, 17, 19, 12, 10] .* (s.size / 25)
    ys = [ 1,  6, 19, 19,  9, 19, 19,  1,  1] .* (s.size / 25)
    d = Any[]
    for (i, (x, y)) in enumerate(zip(xs, ys))
        push!(d, i == 1 ? :M : :L)
        push!(d, x)
        push!(d, y)
    end
    tag(IO, s, :path, [:class   => vcat(classes, s.base - :stroke, s.base - :lambda - :character),
                       :d       => d,
                       :fill    => s.stroke_color,
                       :style  => "stroke:none" ] )
    comment(IO, s, "-- Lambda Columns --")
    hs = [2, 5, 2, 2, 7, 1, 2, 13]
    xo = 1  * (s.size / 25)
    yo = 24 * (s.size / 25)
    lw = 2  * (s.size / 25)
    ls = 1  * (s.size / 25)
    for h in hs
        xs = xo .+ [0, 0, 2, 2] .* (s.size / 25)
        ys = yo .- [0, h, h, 0] .* (s.size / 25)
        d = Any[]
        for (i, (x, y)) in enumerate(zip(xs, ys))
            push!(d, i == 1 ? :M : :L)
            push!(d, x)
            push!(d, y)
        end
        tag(IO, s, :path, [:class   => vcat(classes, s.base - :fill, s.base - :lambda - :column),
                           :d       => d,
                           :fill    => s.fill_color,
                           :style  => "stroke:none" ] )
        xo += lw + ls
    end
    end_g_svg(IO, s)
end

function io_compare(s)
    IO = svg_title_g(s, :io - :compare, "IO Compare")
    classes = [s.base, s.base - :io - :compare, s.base - :io - :compare - s.size]
    comment(IO, s, "-- Left Circle with > --")
    tag(IO, s, :path, [:class           => vcat(classes, s.base - :fill, s.base - :accent - 0, s.base - :io - :compare - :minuend   ),
                       :d               => circle_with_compare(s.size *  9 / 40, s.size * 11 / 40, s.size * 9 / 40, false),
                       :fill - :rule    => "evenodd",
                       :fill            => s.stroke_color,
                       :style           => "stroke:none" ] )
    comment(IO, s, "-- Right Circle with < --")
    tag(IO, s, :path, [:class           => vcat(classes, s.base - :fill, s.base - :accent - 1, s.base - :io - :compare - :subtrahend),
                       :d               => circle_with_compare(s.size * 31 / 40, s.size * 11 / 40, s.size * 9 / 40, true ),
                       :fill - :rule    => "evenodd",
                       :fill            => s.stroke_color,
                       :style           => "stroke:none" ] )
    comment(IO, s, "-- Vertical Line --")
    tag(IO, s, :line, [:class           => vcat(classes, s.base - :stroke, s.base - :io - :compare - :vertical - :line),
                       :x1              => s.size / 2,
                       :y1              => s.size / 40,
                       :x2              => s.size / 2,
                       :y2              => s.size * 39 / 40,
                       :stroke          => s.stroke_color,
                       :stroke - :width => s.size * 2 / 40 ] )
    end_g_svg(IO, s)
end

function circle_with_compare(cx::Real = 0, cy::Real = 0, r::Real = 1, s::Bool = true)
    fx = fy = r / 9
    s && (fx *= -1)
    d = Any[]
    z = 1 + 3.6 / r
    append!(d, [:M, cx, cy - fy])
    append!(d, [:a, r, r, 0, 0, 0, 0, r *  2])
    append!(d, [:a, r, r, 0, 0, 0, 0, r * -2])
    append!(d, [:M, cx - (1.5 * fx), (cy - fy) + 3 * fy])
    append!(d, [:l,  6     * fx,  6     * fy])
    append!(d, [:l, -6     * fx,  6     * fy])
    append!(d, [:l, -z     * fx, -z     * fy])
    append!(d, [:l, (6-z)  * fx, (-6+z) * fy])
    append!(d, [:l, (-6+z) * fx, (-6+z) * fy])
    append!(d, [:L,  cx - (1.5 * fx), (cy - fy) + 3 * fy])
    return d
end


function icon_row(IO, h, ss, name, func)
    begintag(IO, h, :tr)
        beginendtag(IO, h, :td, name)
        for s in ss
            func(s)
            begintag(IO, h, :td)
                write(IO, read(joinpath(ss[1].directory, (name - s.size) * ".svg"), String))
#               tag(IO, h, :img, [:src => "../svg/static/" * (name - s.size) * ".svg"])
            endtag(IO, h, :td)
        end
    endtag(IO, h, :tr)
end



sizes = [16, 20, 24, 32, 40, 48, 64, 80, 96, 128]
ss = map(SvgParameters, sizes)
s = SvgParameters(16)
h = open(joinpath(dirname(@__FILE__), "icons.html"), "w")

writeln(h, s.indent, "<!DOCTYPE html>")
begintag(h, s, :html)
    begintag(h, s, :head)
        tag(h, s, :link, [:rel => :stylesheet, :href => "light.css"])
    endtag(h, s, :head)
    begintag(h, s, :body)
        begintag(h, s, :table)
            begintag(h, s, :tr)
                beginendtag(h, s, :th, "Icon")
                for size in sizes
                    beginendtag(h, s, :th, size - :px)
                end
            endtag(h, s, :tr)
            icon_row(h, s, ss, :io - :compare, io_compare)
            icon_row(h, s, ss, :io - :monitor, io_monitor)
            icon_row(h, s, ss, :simulation, simulation)
            icon_row(h, s, ss, :investment - :optimization, investment_optimization)
            icon_row(h, s, ss, :bar - :adjacent   , bar_adjacent  )
            icon_row(h, s, ss, :bar - :stacked    , bar_stacked   )
            icon_row(h, s, ss, :bar - :percentage , bar_percentage)
            icon_row(h, s, ss, :singular - :axes, singular_axes)
            icon_row(h, s, ss, :axes2columns, axes2columns)
            icon_row(h, s, ss, :axes2rows, axes2rows)
            icon_row(h, s, ss, :axes - :flip, axes_flip)
            icon_row(h, s, ss, :roulette, roulette)
            icon_row(h, s, ss, :pivot, pivot)
            icon_row(h, s, ss, :correlation, correlation)
            icon_row(h, s, ss, :scatter, scatter)
            icon_row(h, s, ss, :line, line)
            icon_row(h, s, ss, :bar, bar)
            icon_row(h, s, ss, :histogram, histogram)
            icon_row(h, s, ss, :pdf, pdf)
            icon_row(h, s, ss, :beeswarm, beeswarm)
            icon_row(h, s, ss, :beeswarm - :overlap , beeswarm_overlap )
            icon_row(h, s, ss, :beeswarm - :separate, beeswarm_separate)
            icon_row(h, s, ss, :beeswarm - :mix     , beeswarm_mix     )
            icon_row(h, s, ss, :cdf, cdf)
            icon_row(h, s, ss, :cdf - :smooth, cdf_smooth)
            icon_row(h, s, ss, :cdf - :stepped, cdf_stepped)
            icon_row(h, s, ss, :cone, cone)
            icon_row(h, s, ss, :box, box)
            icon_row(h, s, ss, :box - :ordered, box_ordered)
            icon_row(h, s, ss, :report - :cover, report_cover)
            icon_row(h, s, ss, :report - :page, report_page)
        endtag(h, s, :table)
    endtag(h, s, :body)
endtag(h, s, :html)

close(h)
