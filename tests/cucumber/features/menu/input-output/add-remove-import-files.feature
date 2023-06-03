Feature: User can upload files, remove them, submit them, or cancel dialog

  Scenario:
    When I open materials designer page
    Then I see material designer page
    # Open
    When I open DefaultImportModalDialog
    Then I see DefaultImportModalDialog

    # Upload
    When I upload files
      | filename       |
      | graphene.json  |
    Then I see the files with formats listed in the data grid
      | filename        | format|
      | graphene.json   | json  |
    And I see the Add button

    # Upload more
    When I upload files
      | filename        |
      | graphene.poscar |
    Then I see the files with formats listed in the data grid
      | filename        | format|
      | graphene.json   | json  |
      | graphene.poscar | poscar|

    # Remove
    When I click the Remove button for a file
      | filename        | format|
      | graphene.poscar | poscar|
    Then I see the files with formats listed in the data grid
      | filename        | format|
      | graphene.json   | json  |

    # Submit
    When I click the Submit button
    Then material with following data exists in state
      | path         | index   |
      | graphene.json| $INT{2} |
    And the DefaultImportModalDialog should be closed

    # Cancel
    When I open DefaultImportModalDialog
    And I cancel import
    Then the DefaultImportModalDialog should be closed

    # Reset
    When I delete materials with index "2"
