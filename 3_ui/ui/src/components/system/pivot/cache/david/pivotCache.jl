# Copyright 2017 Conning, Inc.
# David Weiss

construct_decode(eb, sb) = @eval x->(1+((x-1) >>> ($eb+$sb)), 1+((x-1) << (64-$eb-$sb) >>> (64-$sb)), 1+((x-1) << (64-$eb) >>> (64-$eb)))

struct CachedMatrix{T}
    underlying_matrix::Function         # a Function of two arguments, row coordinates and col coordinates, to retrieve data from the underlying matrix
    element_type::DataType              # the DataType of each cell in the matrix
    rows::Int                           # the number of rows in the underlying matrix
    cols::Int                           # the number of cols in the underlying matrix
    cerb::Int                           # cache entry row size is 2^cerb (which is also 1 << cerb), this is a cache size / tuning parameter, possibly 6
    cecb::Int                           # cache entry col size is 2^cecb (which is also 1 << cecb), this is a cache size / tuning parameter, possibly 5
    csrb::Int                           # cache row size is 2^csrb (which is also 1 << csrb), this is a cache size / tuning parameter, possibly 5
    cscb::Int                           # cache col size is 2^cscb (which is also 1 << cscb), this is a cache size / tuning parameter, possibly 4
    cache::Array{Array{T, 2}, 2}        # a matrix of cache rectangles (i.e. cache entries)
    row_tags::Array{Int, 2}             # the integer value of the high order bits identifying the current cache rectangle occupant's row
    col_tags::Array{Int, 2}             # the integer value of the high order bits identifying the current cache rectangle occupant's col
    row_decode::Function                # a Function to translate a row coordinate into a tag_row (high order bits), cache_row (middle order bits), and entry_row (low order bits)
    col_decode::Function                # a Function to translate a row coordinate into a tag_row (high order bits), cache_row (middle order bits), and entry_row (low order bits)
end

function CachedMatrix(underlying_matrix, element_type, rows, cols, cerb, cecb, csrb, cscb) # see descriptions of inputs above
    cache = Array(Array{element_type, 2}, 1 << csrb, 1 << cscb)
    row_tags = fill(0, 1 << csrb, 1 << cscb)
    col_tags = copy(row_tags)
    CachedMatrix(underlying_matrix, element_type, rows, cols, cerb, cecb, csrb, cscb, cache, row_tags, col_tags, construct_decode(cerb, csrb), construct_decode(cecb, cscb))
end

Base.size(a::CachedMatrix) = (a.rows, a.columns)

function Base.getindex(a::CachedMatrix, row::Int, col::Int)                                         # works for one cell at a time (see next method for getting a matrix)
    assert((row >= 0) && (row <= a.rows) && (col >= 0) && (col <= a.cols))                          # make sure the request is in bounds
    tag_row, cache_row, entry_row = a.row_decode(row)
    tag_col, cache_col, entry_col = a.col_decode(col)
    if tag_row != a.row_tags[cache_row, cache_col] || tag_col != a.col_tags[cache_row, cache_col]   # not in cache
        println("cache miss")
        row_start = 1 + ((tag_row - 1) << (a.cerb + a.csrb)) + ((cache_row - 1) << a.cerb)
        col_start = 1 + ((tag_col - 1) << (a.cecb + a.cscb)) + ((cache_col - 1) << a.cecb)
        a.cache[cache_row, cache_col] = a.underlying_matrix(row_start:min(a.rows, row_start - 1 + (1 << a.cerb)), col_start:min(a.cols, col_start - 1 + (1 << a.cecb)))
        a.row_tags[cache_row, cache_col] = tag_row                                                  # identify new cache entry by its tag_row
        a.col_tags[cache_row, cache_col] = tag_col                                                  # identify new cache entry by its tag_col
    end
    return a.cache[cache_row, cache_col][entry_row, entry_col]                                      # index the cache entry, and then the cell from that entry
end

function Base.getindex(a::CachedMatrix, rows, cols)                                                 # works for a matrix
    b = Array(a.element_type, length(rows), length(cols))                                           # uninitialized output array
    bc = 0                                                                                          # col index into output array
    @inbounds for c in cols
        bc += 1
        br = 0                                                                                      # row index into output array
        @inbounds for r in rows
            b[br += 1, bc] = a[r, c]
        end
    end
    return b
end

# Testing below

function array_on_demand(rr, cc)
    a = Array(Float64, length(rr), length(cc))
    ac = 0
    for c in cc
        ac += 1
        ar = 0
        for r in rr
            a[ar += 1, ac] = r + c / 1000
        end
    end
    return a
end

function run_test(cm, td)
    for r in 1:first(size(td))
        ro, co, nr, nc = td[r,:]
        t = time_ns()
        x = cm[ro+(0:nr-1), co+(0:nc-1)]
        b = x == cm.underlying_matrix(ro+(0:nr-1), co+(0:nc-1))
        t = Int64(time_ns() - t)
        @show b, t, ro, co, nr, nc
    end
    return true
end

a = CachedMatrix(array_on_demand, Float64, 10_000_000, 800, 6, 5, 6, 4)

testdata = [
            1       1       31      20
            10      1       31      20
            40      1       31      20
            70      1       31      20
            100     1       31      20
            70      1       31      20
            40      1       31      20
            10      1       31      20
            999970  1       31      20
            1       1       31      20
            1       1       51      31
            1       10      51      31
            1       40      51      31
            1       70      51      31
            1       100     51      31
            1       1       51      31
            999950  770     51      31
            1       1       51      31
            2       1       51      31
            3       1       51      31
            4       1       51      31
            5       1       51      31
            6       1       51      31
            7       1       51      31
            8       1       51      31
            9       1       51      31
            10      1       51      31
            11      1       51      31
            12      1       51      31
            13      1       51      31
            14      1       51      31
            1       1       26      16
            2       1       26      16
            3       1       26      16
            4       1       26      16
            5       1       26      16
            6       1       26      16
            7       1       26      16
            8       1       26      16
            9       1       26      16
            10      1       26      16
            11      1       26      16
            12      1       26      16
            13      1       26      16
            14      1       26      16
            ]

run_test(a, testdata)

#=

The test emits "cache miss" every time the underlying_matrix function is called.
For each test, it emits:
  a Boolean (true if data is correct)
  time in nanoseconds for access
followed by the four parameters that describe the data requested:
  starting row
  starting column
  number of rows
  number of columns

=#
