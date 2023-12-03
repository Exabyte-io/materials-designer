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
    When I create materials with the following data
    | name  | basis    | lattice                    |
    | Ni    | Ni 0 0 0 | {"type": "FCC", "a": 2.46} |
    And I open PythonTransformationDialog
    And I see PythonTransformationDialog
    And I select material with index "1" in MaterialsSelector
    And I set code input from the file "../fixtures/create-slab.py"

    And I click the Run button
    Then I see code output with the data from the file "../fixtures/ni.poscar"
    And I submit python transformation
    Then material with following data exists in state
    | path         | index   |
    | si-slab.json | $INT{2} |
