@watch
Feature: User can create a material, then undo the changes and/or reset to the initial state

  Scenario:
    When I open materials designer page
    Then I see material designer page
    # Reset
    When I create materials with the following data
      | name    | basis                          | lattice                                                 |
      | initial | H 0.62 0 0;H 0 0 0; H 0.13 0 0 | {"type":"TET", "a":6.350127,"b":2.645886, "c":2.645886} |
      | final   | H 0.87 0 0;H 0 0 0; H 0.38 0 0 | {"type":"TET", "a":6.350127,"b":2.645886, "c":2.645886} |
    And I select material with index "1" from material designer items list
    And I generate interpolated set with "1" intermediate images
    Then material with following data exists in state
      | path            | index   |
      | H2+H-image.json | $INT{2} |
    When I select "reset" option from the Edit menu
    Then material with following data exists in state
      | path    | index   |
      | si.json | $INT{1} |

    # Clone a default material
    When I clone material at index "1"
    Then material with following data exists in state
      | path          | index   |
      | si-clone.json | $INT{2} |

    # Undo
    When I select "undo" option from the Edit menu
    Then material with following data does not exist in state
      | path    | index   |
      | si-clone.json | $INT{2} |

    # Redo
    When I select "redo" option from the Edit menu
    Then material with following data exists in state
      | path          | index   |
      | si-clone.json | $INT{2} |

