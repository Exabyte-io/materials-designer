Feature: User can create a supercell

  Scenario:
    When I open materials designer page
    Then I see material designer page
    When I create materials with the following data
      | name      | basis                      | supercell           |
      | supercell | Si 0 0 0;Si 0.25 0.25 0.25 | 2 0 0, 0 1 0, 0 0 1 |
    Then material with following data exists in state
      | path              | index   |
      | si-supercell.json | $INT{0} |
