@watch
Feature: User can upload files, remove them, submit them, or cancel dialog

  Scenario:
    When I open materials designer page
    Then I see material designer page
    # Open
    When I open DefaultImportModalDialog
    Then I see DefaultImportModalDialog
    
    # Upload
    When I upload files
    Then I should see the files listed in the data grid
    And the formats of the files should be displayed

    # Remove
    When I click the Remove button for a file
    Then that file should no longer be listed in the data grid

    # Submit
    When I click the Submit button
    Then the onSubmit function should be called
    And the DefaultImportModalDialog should be closed

    # Cancel
    When I open DefaultImportModalDialog
    And I cancel import
    Then I cancel import
    And the DefaultImportModalDialog should be closed
