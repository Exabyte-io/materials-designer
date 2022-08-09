Feature: User can cancel active multiple selection and all changes should be reverted
  
  Scenario:
    When I open materials designer page
    And I create materials with the following data
      | name      | basis             |
      | supercell | Si 0 0 0;Si 0 0 0 |
    And I open multi-material 3D editor

    # set default positions for easier expectations calculations
    And I toggle scene object "supercell" opener inside 3D editor
    And I toggle scene object "Atoms" opener inside 3D editor
    And I select scene object "Si-0" inside 3D editor
    And I set position of scene object with the following data:
      | x    | y    | z    |
      | -1.0 | -1.0 | -1.0 |
    And I select scene object "Si-1" inside 3D editor
    And I set position of scene object with the following data:
      | x   | y   | z   |
      | 1.0 | 1.0 | 1.0 |

    # select atoms and move them a bit
    And I click on "Toggle Multiple Selection" toolbar button
    And I make multiple-selection with the following coordinates:
      | x1           | y1           | x2          | y2          |
      | $FLOAT{-0.5} | $FLOAT{-0.5} | $FLOAT{0.5} | $FLOAT{0.5} |
    And I set position of scene object with the following data:
      | x   | y   | z   |
      | 1.0 | 1.0 | 1.0 |

    # cancel multiple selection
    And I click on "Cancel Multiple Selection" toolbar button

    # expect that atoms have initial positions and weren't changed
    And I select scene object "Si-0" inside 3D editor
    Then I see that scene object has the following position:
      | x            | y            | z            |
      | $FLOAT{-1.0} | $FLOAT{-1.0} | $FLOAT{-1.0} |
    And I select scene object "Si-1" inside 3D editor
    Then I see that scene object has the following position:
      | x            | y            | z            |
      | $FLOAT{1.0}  | $FLOAT{1.0}  | $FLOAT{1.0}  |
