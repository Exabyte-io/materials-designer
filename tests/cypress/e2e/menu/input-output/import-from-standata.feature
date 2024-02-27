Feature: User can import files from Standata

  Scenario:
    When I open materials designer page
    Then I see material designer page

    # Open
    When I open Standata dialog
    Then I see Standata dialog

    # Import
    When I import material "C, Graphene, HEX (P6/mmm) 2D (Monolayer), 2dm-3993" from Standata

    Then material with following data exists in state
      | standata                                           | index   |
      | C, Graphene, HEX (P6/mmm) 2D (Monolayer), 2dm-3993 | $INT{2} |

    # Cleanup
  Then I delete materials with index "2"
