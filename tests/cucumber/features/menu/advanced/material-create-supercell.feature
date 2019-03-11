Feature: Supercell generation functionality
  User can create multiple supercells and their basis coordinates are stored as expected

  Background:
    Given Users are created with the following data:
      | username     | cacheKey |
      | ${!user-,10} | user     |

  @ui
  Scenario:
    When I log in as "$CACHE{user:username}" user
    And I open my account page
    And I open account "Materials" tab
    And I run "create" tool of "accountMaterials" explorer
    And I create materials with the following data
      | name        | basis                      | supercell              |
      | supercell-1 | Si 0 0 0;Si 0.25 0.25 0.25 | 2 0 0, 0 1 0, 0 0 1    |
      | supercell-2 | Si 0 0 0;Si 0.25 0.25 0.25 | 0 1 1, 1 0 1, 1 1 0    |
      | supercell-3 | Si 0 0 0;Si 0.25 0.25 0.25 | 2 0 0, 0 1 1, 1 0 1    |
      | supercell-4 | Si 0 0 0;Si 0.25 0.25 0.25 | 1 1 -1, -1 1 1, 1 -1 1 |
    # checking value for one coordinate only below
    Then I see the following items inside "accountMaterials" explorer:
      | name                                                 | owner.slug            | basis.coordinates.3.value.2 |
      | supercell-1 - supercell [[2,0,0],[0,1,0],[0,0,1]]    | $CACHE{user:username} | $FLOAT{0.250}               |
      | supercell-2 - supercell [[0,1,1],[1,0,1],[1,1,0]]    | $CACHE{user:username} | $FLOAT{0.625}               |
      | supercell-3 - supercell [[2,0,0],[0,1,1],[1,0,1]]    | $CACHE{user:username} | $FLOAT{0.000}               |
      | supercell-4 - supercell [[1,1,-1],[-1,1,1],[1,-1,1]] | $CACHE{user:username} | $FLOAT{0.500}               |
