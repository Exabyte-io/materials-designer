@watch
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

    # Create a slab from material using python transformation
    When I open PythonTransformationDialog
    Then I see PythonTransformationDialog
    And I set code input from the file "../fixtures/create-slab.py"

    And I click the Run button
    Then I see code output with the data from the file "../fixtures/si-slab.poscar"
    And I submit python transformation
    Then material with following data exists in state
    | path         | index   |
    | si-slab.json | $INT{2} |
