---
title: "Let My Users Go: Analyzing a Store Layout"
date: 2018-06-06T09:02:23-04:00
draft: true
---


Design is in everything we see.

You don't notice good design.

You do notice bad design.

Sometimes design is hard.

I was at a store recently with bad design, and the signs were there.  First, there was literally a sign telling customers where to line up for the checkout line.  Second, customers didn't naturally line up there.  Third, an employee was telling customers where to line up.  This is bad design.

Here's a quick sketch of the layout:

```python
"""
     #              ##############################
     #              #                            #
     #              # Gift wrapping supplies     #
     #              #                            #
     #              #                            #
     #              #                            #
     #              #                   #        #
     #              #                   #        #
     #              #                   #        #
     #              #                   #        #
     #              #                   #        #
     #              #                   #        #
     #              #                   #   A    #
     #              #                   #        #
     #              #                  #         #
     #              #              2 #           #
     #              #           1 #              #
     #              #         #                  #
     #              #########                    #
     ################   B                        #
                                                 #
                                                 #
                                                 #
        ----------                               #
       | display  |                              #
        ----------                               #
                                                 #
                                 entrance/exit   #
                                      ||         #
                                      \/         #
"""
```

A curved counter extended from one wall down towards the back of the store.  Two cash registers were on the bottom-right section of the curve.  There was a display of small checkout-trinkets at B and calligraphy materials on the right wall at A.

Where would you line up?  Where would you want customers to line up?

Customers would naturally approach the cash registers from where they had been, and we can assume that they will usually be coming from the rest of the store where the majority of the supplies are.  They can spend time waiting in line looking at the checkout-trinkets ("I _should_ buy a mini rubrick's cube and a pocket magnifying glass for $2.99!"), and as they move through the line to the cash register, they can turn to the right and follow the wall to the exit.

Instead, they had a sign hanging from the ceiling above A that said something along the lines of "Line starts here."  Customers would naturally line up at B, and one of the employees would let them know that the line began at A.  From the employee's exasperated tone, this clearly happened often and it was the customer's fault.

Customers would then walk over to A.  If there was a line, they would then walk to the back of the store to go into the line.  It didn't seem like there was a line, but now there was an additional wait as the customer went from first in line to last.  A's corridor is only around two people wide, which meant congestion and many "excuse me pardon me" as people shuffled past and even more if someone was looking at the calligraphy section.

This is wasted energy.  Walking to the rear of the store to walk towards the front is a waste of the customer's time and energy.  The jump from "I'm next in line" to "Oh, there are people ahead of me" is unnecessary.   Blaming the customers is absolutely wasted energy.  In retail, it does not take much to make some customers unhappy.  Directing customers with a sign and an employee is a waste of the employee's time and energy.

(Disclaimer: I was not one of the disgruntled customers, and this is not a form of revenge.  Life is too short to worry about things like getting to check out first, but life is not too short to worry about improving peoples' experiences.  Additionally, this )

How can we tell this is bad design?  We can tell it's not intuitive, as customers are not behaving this way by default.  We can tell it's not working as expected because they [had to put up a sign](TODO: link to norman doors).  We can tell it's not a natural flow because the employee has to tell people where to go and the majority of customers are not going to the checkout from the gift wrapping section.

Users are very generous, as they will show you what they expected by trying to do that first.  Seeing someone use something without direction illuminates the differences between the assumptions of the designer and the assumptions of the user.  It lets you build empathy for your user.

In this case, the customers are already showing the store what is intuitive.  Let customers line up at B.  Ditch the sign. Let your employee not have to direct, and let customers go to the rear of the store if they want to wrap gifts.  Keep it simple.

Design isn't always easy, but it's not always hard.

PS: If you can tell what store this is, I'll buy you a beer/coffee/tea if you're ever in Boston.
PPS: The store may be in the Boston area.
