Feature: User can create an interpolated set

  Scenario:
    When I open materials designer page
    Then I see material designer page
    When I create materials with the following data
      | name    | basis                          | lattice                                                 |
      | initial | H 0.62 0 0;H 0 0 0; H 0.13 0 0 | {"type":"TET", "a":6.350127,"b":2.645886, "c":2.645886} |
      | final   | H 0.87 0 0;H 0 0 0; H 0.38 0 0 | {"type":"TET", "a":6.350127,"b":2.645886, "c":2.645886} |
    And I select material with index "1" from material designer items list
    And I generate interpolated set with "1" intermediate images
    Then material with following data exists in state
      | path            | index   |
      | H2+H-image.json | $INT{2} |
