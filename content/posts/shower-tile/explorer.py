import random
import statistics

'''
Let's imagine we have a square of pixels, imagined here as 0s

000
000
000

We want to answer this question: for a certain size large square (let's call it the full map) and a sampling (call it
the minimap), how many samplings to we have to take on average until we cover the full map?


Ah, but if we want to see when we see a repeat, we'll need some buffer space outside

-----
-000-
-000-
-000-
-----

That way we'll know we would have seen a repeat if we see something like

-----
1111-
1111-
-000-
-----


Since that top row's left buffer would really be it's right
-----
X11X-
1111-
-000-
-----


We kind of need enough buffer to have a single pixel picked, so SELECTION_SIZE - 1

'''


FULL_MAP_SIZE = 40
SELECTION_SIZE = 2
EDGE_BUFFER = SELECTION_SIZE - 1
FULL_MAP_SIZE_WITH_BUFFER = EDGE_BUFFER + FULL_MAP_SIZE + EDGE_BUFFER

# Shamelessly cribbed straight from https://svn.blender.org/svnroot/bf-blender/trunk/blender/build_files/scons/tools/bcolors.py
# and https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
class colors:
    GREEN = '\033[38;5;34m'
    YELLOW = '\033[93m'
    GREY = '\033[38;5;242m'
    RED = '\033[91m'
    ENDC = '\033[0m'



def create_full_map(side_length):
    length_with_buffer = EDGE_BUFFER + side_length + EDGE_BUFFER
    # Googling list comprehension was the first step on my journey to joining Google, no joke!
    full_map = [
        [0 for _ in range(length_with_buffer)]
        for _ in range(length_with_buffer)
    ]
    return full_map



def pretty_print_map(full_map):
    # Print each row on a separate line so it looks nicer.
    for y, row in enumerate(full_map):
        row_string = ''
        for x, value in enumerate(row):
            # If it's the main part of the map, print as grey
            if is_buffer(x, y):
                row_string += colors.GREY + str(value) + " " + colors.ENDC
            else:
                row_string += colors.GREEN + str(value) + " " + colors.ENDC
        print(row_string)
    print('')



def is_buffer(x, y):
    return (x < EDGE_BUFFER or x > EDGE_BUFFER + FULL_MAP_SIZE - 1) or (y < EDGE_BUFFER or y > EDGE_BUFFER + FULL_MAP_SIZE - 1)


def select_random_section():
    # Probably the simplest thing to do is to pick a random top left corner, given what we know about the map.
    # For a 4x4 map and a section_size of 2, the possible values are [0, 2] for x and y.
    # For an NxN map and a section_size of M, the possible values are [0, N - M]. That's not bad!
    max_position = FULL_MAP_SIZE_WITH_BUFFER - SELECTION_SIZE
    top_left_x = random.randint(0, max_position)
    top_left_y = random.randint(0, max_position)
    return (top_left_x, top_left_y)


def is_visit(x, y, top_left_x, top_left_y):
    return ((x >= top_left_x and x < top_left_x + SELECTION_SIZE) and
            (y >= top_left_y and y < top_left_y + SELECTION_SIZE))

def mark_visited(current_map, section_top_left):
    # Fill in the map where we have this random selection.
    top_left_x = section_top_left[0]
    top_left_y = section_top_left[1]
    for x in range(top_left_x, top_left_x + SELECTION_SIZE):
        for y in range(top_left_y, top_left_y + SELECTION_SIZE):
            current_map[y][x] = 1

def pretty_print_map_with_selection(full_map, section_top_left):
    top_left_x = section_top_left[0]
    top_left_y = section_top_left[1]
    # Print each row on a separate line so it looks nicer.
    for y, row in enumerate(full_map):
        row_string = ''
        for x, value in enumerate(row):
            # If it's the main part of the map, print as grey
            if is_visit(x, y, top_left_x, top_left_y):
                row_string += colors.YELLOW + str(value) + " " + colors.ENDC
            elif is_buffer(x, y):
                row_string += colors.GREY + str(value) + " " + colors.ENDC
            else:
                row_string += colors.GREEN + str(value) + " " + colors.ENDC
        print(row_string)
    print('')


def pretty_print_map_with_repeat_found(full_map, repeat_result):
    # Print each row on a separate line so it looks nicer.
    for y, row in enumerate(full_map):
        row_string = ''
        for x, value in enumerate(row):
            # If it's the main part of the map, print as grey
            if x == repeat_result[1] or y == repeat_result[2]:
                row_string += colors.RED + str(value) + " " + colors.ENDC
            elif is_buffer(x, y):
                row_string += colors.GREY + str(value) + " " + colors.ENDC
            else:
                row_string += colors.GREEN + str(value) + " " + colors.ENDC
        print(row_string)
    print('')

def repeat_found(current_map):
    # We can define a repeat as any row that has been completely visited past the main map,
    # so either [start - 1, end] or [start, end + 1]
    start_index = EDGE_BUFFER # One after the edge buffer, 0-indexed
    end_index = EDGE_BUFFER + FULL_MAP_SIZE # One after the full map, 0-indexed

    overlap_start_index = start_index - 1
    overlap_end_index = end_index
    # First check the rows. For every row, if we have at least one overlap pixel, check the full row.
    for y, row in enumerate(current_map):
        if row[overlap_start_index] or row[overlap_end_index]:
            all_visited = True
            for x in range(start_index, end_index):
                all_visited = all_visited and row[x]
            if all_visited:
                # print('all visited for row', y)
                return (True, None, y)

    # Now check the columns. For every column, if we have at least one overlap pixel, check the full column.
    for x in range(start_index, end_index):
        if current_map[overlap_start_index][x] or current_map[overlap_end_index][x]:
            all_visited = True
            for y in range(start_index, end_index):
                all_visited = all_visited and current_map[y][x]
            if all_visited:
                # print('all visited for column', x)
                return (True, x, None)

    return (False, None, None)


def run_test():
    full_map = create_full_map(FULL_MAP_SIZE)
    # pretty_print_map(full_map)
    attempts_taken = 0
    repeat_results = (False, None, None)
    while not repeat_results[0]:
        attempts_taken += 1
        # print('Attempt', attempts_taken)
        random_selection_top_left_corner = select_random_section()
        # print(f"Visiting {SELECTION_SIZE}x{SELECTION_SIZE} square with top left: {random_selection_top_left_corner}")
        # print('Map with last visit:')
        mark_visited(full_map, random_selection_top_left_corner)
        # pretty_print_map_with_selection(full_map, random_selection_top_left_corner)
        # print('Current full map:')
        # pretty_print_map(full_map)
        repeat_results = repeat_found(full_map)
    # print('Map with repeat selection:')
    # pretty_print_map_with_repeat_found(full_map, repeat_results)
    return attempts_taken

# print('Samples required: ', attempts)


TEST_RUNS = 1000

def run_tests():
    # print(f"FULL_MAP_SIZE:{FULL_MAP_SIZE}, SELECTION_SIZE:{SELECTION_SIZE}, EDGE_BUFFER:{EDGE_BUFFER}, FULL_MAP_SIZE_WITH_BUFFER:{FULL_MAP_SIZE_WITH_BUFFER}")
    results = []

    # print(f"TEST_RUNS:{TEST_RUNS}")
    for _ in range(TEST_RUNS):
        attempts_taken = run_test()
        results.append(attempts_taken)

    print(f"{SELECTION_SIZE},{statistics.median(results)}")


print(f"FULL_MAP_SIZE:{FULL_MAP_SIZE}")
for selection_size in range(2, FULL_MAP_SIZE):
    SELECTION_SIZE = selection_size
    run_tests()

run_tests()

