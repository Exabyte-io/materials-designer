Feature: User can open Python Transformation dialog, change python code and run it, or cancel dialog

  Scenario:
    When I open materials designer page
    Then I see material designer page

    # Open
    When I open PythonTransformationDialog
    Then I see PythonTransformationDialog

    # Change code
    When I set code input with the following data:
    """
    print('Hello Matera!')
    """

    # Run
    When I click the Run button
    Then I see code output with the following data:
    """
    Hello Matera!
    """

    # Cancel
    When I cancel PythonTransformationDialog
    Then I see PythonTransformationDialog is closed
