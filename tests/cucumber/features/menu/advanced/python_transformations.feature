Feature: User can open Python Transformation dialog, change python code and run it, or cancel dialog

  Scenario:
    When I open materials designer page
    Then I see material designer page

    # Open
    When I open PythonTransformationDialog
    Then I see PythonTransformationDialog

    # Change code
    When I set input with the following data:
    """
    print('Hello Matera!')
    """
    And I cancel PythonTransformationDialog
    Then I see PythonTransformationDialog is closed

    # Code persists
    When I open PythonTransformationDialog
    Then I see input with the following data:
    """
    print('Hello Matera!')
    """

    # Run
    When I click the Run button
    Then I see code output "Hello world"

