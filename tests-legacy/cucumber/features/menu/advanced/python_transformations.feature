@watch
Feature: User can open Python Transformation dialog, change python code and run it, or cancel dialog

  Scenario:
    When I open materials designer page
    Then I see material designer page

    # Open
    When I open PythonTransformationDialog
    Then I see PythonTransformationDialog

    # Change code
    Then I select transformation with title "Custom Transformation"
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
    And I clear the output with index "0"

    # Cancel
    When I cancel PythonTransformationDialog
    Then I see PythonTransformationDialog is closed

    # Create a slab from material using python transformation
    When I create materials with the following data
    | name  | basis    | lattice                                       |
    | Ni    | Ni 0 0 0 | {"type":"FCC", "a":2.46, "b":2.46, "c":2.46 } |
    And I open PythonTransformationDialog
    And I see PythonTransformationDialog
    And I select material with index "1" in MaterialsSelector
    And I set code input from the file "../fixtures/create-slab.py"

    And I click the Run button
    Then I see code output with the data from the file "../fixtures/ni-slab.poscar"
    And I clear the output with index "0"
    And I submit python transformation
    Then material with following data exists in state
    | path         | index   |
    | ni-slab.json | $INT{2} |

    # Create an interface between Gr and Ni(111)
    When I delete materials with index "2"
    When I create materials with the following data
    | name     | basis                           | lattice                                       |
    | Ni       | Ni 0 0 0                        | {"type":"FCC", "a":2.46, "b":2.46, "c":2.46 } |
    | Graphene | C 0 0 0; C 0.333333 0.666667 0  | {"type":"HEX", "a":2.467291, "b":2.467291, "c":20 } |
    And I open PythonTransformationDialog
    And I see PythonTransformationDialog
    And I select transformation with title "Custom Transformation"
    And I select material with index "2" in MaterialsSelector
    And I set code input from the file "../fixtures/create-interface.py"
    And I click the Run button
    Then I see code output with the data from the file "../fixtures/gr-ni-interface.poscar"
    And I clear the output with index "0"

    When I submit python transformation
    Then material with following data exists in state
    | path               | index   |
    |gr-ni-interface.json| $INT{3} |
