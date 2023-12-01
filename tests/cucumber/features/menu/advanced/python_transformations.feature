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
    Then I see code output with the following data:
    """
[{'poscar': 'Si \n 1.0000000000000000\n     3.8669994891948205    0.0000000000000000    0.0000000000000000\n    -1.9334997954783326    3.3489201768328622    0.0000000000000000\n     0.0000000000000000   -0.0000000000000000   18.6828286884654418\n Si \n   6\nCartesian\n  0.0000000000000000  0.0000000000000000  5.0000000000000000\n  1.9334996682760266  3.3489201172313008  7.3680441877633029\n  1.9334996937164879  1.1163066461422042  8.1573922503510694\n  1.9334996682760255  1.1163065865406430 10.5254364381143724\n -0.0000001017618445  2.2326132922844084 11.3147845007021388\n -0.0000001272023065  2.2326132326828469 13.6828286884654418\n', 'metadata': {}}]
    """
