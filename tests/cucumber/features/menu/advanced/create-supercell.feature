Feature: User can create multiple supercells

  Scenario:
    When I open materials designer page
    Then I see material designer page
    When I create materials with the following data
      | name        | basis                      | supercell              |
      | supercell-1 | Si 0 0 0;Si 0.25 0.25 0.25 | 2 0 0, 0 1 0, 0 0 1    |
      | supercell-2 | Si 0 0 0;Si 0.25 0.25 0.25 | 0 1 1, 1 0 1, 1 1 0    |
      | supercell-3 | Si 0 0 0;Si 0.25 0.25 0.25 | 2 0 0, 0 1 1, 1 0 1    |
      | supercell-4 | Si 0 0 0;Si 0.25 0.25 0.25 | 1 1 -1, -1 1 1, 1 -1 1 |
