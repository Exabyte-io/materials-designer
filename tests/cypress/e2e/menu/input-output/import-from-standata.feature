Feature: User can import files from Standata

  Scenario:
    When I open materials designer page
    Then I see material designer page

    # Open
    When I open Standata dialog
    Then I see Standata dialog

    # Import
    When I import material "Graphene (mp-1040425)" from Standata
    Then material with following data exists in state
      | standata              | index   |
      | Graphene (mp-1040425) | $INT{2} |

    # Cleanup
  Then I delete materials with index "2"
