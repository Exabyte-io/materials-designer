Feature: NEB images generation functionality
  User can create NEB images from a set of initial/final structures and save them inside a set

  Background:
    Given Users are created with the following data:
      | username     | cacheKey |
      | ${!user-,10} | user     |

  Scenario:
    When I log in as "$CACHE{user:username}" user
    And I open my account page
    Then I see account page

    # create an ordered set to save images in
    When I open account "Materials" tab
    And I create a set with name "H2+H" from "accountMaterials" explorer
    Then I see the following items inside "accountMaterials" explorer:
      | name | isEntitySet    |
      | H2+H | $BOOLEAN{true} |
    When I run "changeType" action of "accountMaterials" explorer for item with the following data:
      | name | isEntitySet    |
      | H2+H | $BOOLEAN{true} |
    And I change the set type to "ordered" from "accountMaterials" explorer
    Then I see the following items inside "accountMaterials" explorer:
      | name | isEntitySet    | entitySetType |
      | H2+H | $BOOLEAN{true} | ordered       |

    # upload initial and final structures
    When I import materials with the following names:
      | name                          |
      | materials/H2+H-initial.poscar |
      | materials/H2+H-final.poscar   |
    And I search for "H2" inside "accountMaterials" explorer
    Then I see the following items inside "accountMaterials" explorer:
      | name         |
      | H2+H-final   |
      | H2+H-initial |

    # import initial and final structures into the designer
    And I run "create" tool of "accountMaterials" explorer
    And I open import modal of material designer
    And I search for "H2" inside "importMaterialsExplorer" explorer
    And I select the following items from "importMaterialsExplorer" explorer:
      | name         | owner.slug            |
      | H2+H-initial | $CACHE{user:username} |
    And I run "selectItems" tool of "importMaterialsExplorer" explorer
    Then I see material designer page
    And I open import modal of material designer
    And I search for "H2" inside "importMaterialsExplorer" explorer
    And I select the following items from "importMaterialsExplorer" explorer:
      | name       | owner.slug            |
      | H2+H-final | $CACHE{user:username} |
    And I run "selectItems" tool of "importMaterialsExplorer" explorer
    Then I see material designer page

    # generate and save images
    When I remove material with index "1" from material designer items list
    And I generate interpolated set with "1" intermediate images
    Then I see material designer page
    When I open save dialog of material designer
    And I open materials set select modal of material designer
    And I search for "H2" inside "materialsSetSelectExplorer" explorer
    And I select the following items from "materialsSetSelectExplorer" explorer:
      | name | isEntitySet    |
      | H2+H | $BOOLEAN{true} |
    And I run "selectItems" tool of "materialsSetSelectExplorer" explorer
    And I save all designer materials
    And I exit materials designer
    Then I see the following items inside "accountMaterials" explorer:
      | name | isEntitySet    | entitySetType |
      | H2+H | $BOOLEAN{true} | ordered       |
    When I run "open" action of "accountMaterials" explorer for item with the following data:
      | name | isEntitySet    | entitySetType |
      | H2+H | $BOOLEAN{true} | ordered       |
    Then I see the following items inside "accountMaterials" explorer:
      | name                 |
      | H2+H-initial         |
      | 0 - H2+H-initial - H |
      | H2+H-final           |
