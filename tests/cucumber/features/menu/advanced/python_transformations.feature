Feature: User can open Python Transformation dialog, change python code and run it, or cancel dialog

  Scenario:
    When I open materials designer page
    Then I see material designer page

    # Open
    When I open PythonTransformationDialog
    Then I see PythonTransformationDialog

    # Change code
    When I set input with the following data
      | code | print('Hello world') |
    And I close PythonTransformationDialog
    Then I see PythonTransformationDialog is closed
    And I open PythonTransformationDialog
    Then I see input with the following data
      | code | print('Hello world') |
    Then I see code "print('Hello world')"

    # Run
    When I click the Run button
    Then I see code output "Hello world"

