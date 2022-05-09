N = 100


# Helper functions to regenerate the sums/products data structures every round.
# Not optimal but hey this is for fun.
def generate_sums(candidate_pairs):
    sums = {}
    for tuple_pair in candidate_pairs:
        (i, j) = tuple_pair
        sum = i + j
        if sum not in sums:
            sums[sum] = [tuple_pair]
        else:
            sums[sum].append(tuple_pair)
    return sums


def generate_products(candidate_pairs):
    products = {}
    for tuple_pair in candidate_pairs:
        (i, j) = tuple_pair
        product = i * j
        if product not in products:
            products[product] = [tuple_pair]
        else:
            products[product].append(tuple_pair)
    return products


def foo():
    # First, generate all possible pairs from (1, 1) to (N-1, N-1).
    candidate_pairs = set()
    for i in range(1, N):
        for j in range(i, N):
            candidate_pairs.add((i, j))

    # Swap between hearing from Peter or Sandy every round (product or sum)
    do_not_know_product = True
    round = 1
    while True:
        print('candidate_pairs', candidate_pairs)
        sums = generate_sums(candidate_pairs)
        print('sums', sums)
        foo = [sum for sum in sums]
        print('*********')
        foo.sort()
        print(foo)
        print('*********')
        products = generate_products(candidate_pairs)
        print('products', products)
        foo = [product for product in products]
        print('*********')
        foo.sort()
        print(foo)
        print('*********')
        if round == 2:
            return
        # First, check if there's a single product left with one pair.
        if round == 15:
            for product in products:
                if len(products[product]) == 1:
                    print('Peter: I do know the numbers')
                    print(products[product][0])
                    return
        if do_not_know_product:
            print('Peter: I don\'t know the numbers')
        else:
            print('Sandy: I don\'t know the numbers')

        if do_not_know_product:
            # Go through products. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for product in products:
                if len(products[product]) == 1:
                    tuple_pair = products[product][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = False
        else:
            # Go through sums. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for sum in sums:
                if len(sums[sum]) == 1:
                    tuple_pair = sums[sum][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = True
        round += 1


def find_pairs(n):
    # First, generate all possible pairs from (1, 1) to (N-1, N-1).
    candidate_pairs = set()
    for i in range(1, n):
        for j in range(1, n):
            if (i, j) not in candidate_pairs and (j, i) not in candidate_pairs:
                candidate_pairs.add((i, j))

    # Swap between hearing from Peter or Sandy every round (product or sum)
    do_not_know_product = True
    round = 1
    while True:
        print('candidate_pairs', candidate_pairs)
        sums = generate_sums(candidate_pairs)
        print('sums', sums)
        products = generate_products(candidate_pairs)
        print('products', products)
        name = 'Peter:' if do_not_know_product else 'Sandy:'
        if round == 2:
            print('jsldfjlkasdjf')
            print(products[7280])
            return

        potential_final = None
        # First, check if there's a single product left with one pair.
        if do_not_know_product:
            count_unique_product_pairs = 0
            for product in products:
                if len(products[product]) == 1:
                    count_unique_product_pairs += 1
                    potential_final = products[product][0]
            if count_unique_product_pairs == 1:
                print(name, 'I could know the numbers after',
                      round, 'rounds:', potential_final)
        else:
            count_unique_sum_pairs = 0
            for sum in sums:
                if len(sums[sum]) == 1:
                    count_unique_sum_pairs += 1
                    potential_final = sums[sum][0]
            if count_unique_sum_pairs == 1:
                print(name, 'I could know the numbers after',
                      round, 'rounds:', potential_final)

        num_candidates_before_cull = len(candidate_pairs)
        if do_not_know_product:
            # Go through products. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for product in products:
                if len(products[product]) == 1:
                    tuple_pair = products[product][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = False
        else:
            # Go through sums. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for sum in sums:
                if len(sums[sum]) == 1:
                    tuple_pair = sums[sum][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = True
        round += 1
        # If we didn't remove any pairs, we may be in an infinite loop and want
        # to stop.
        # if round == 1000:
        #     return
        if len(candidate_pairs) == num_candidates_before_cull:
            return


if __name__ == '__main__':
    i = 100
    print('N =', i)
    foo()
    print('*****')
