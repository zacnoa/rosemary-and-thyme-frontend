import { Recipe } from "~/model/interfaces/Recipe";

export function createDefaultRecipe(): Recipe {
  console.log("called recipe")
  return {
    authorId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    authorName: "Noa",
    createDate: new Date(2026, 25, 3),
    name: "Chicken Katsu",
    description: "Chicken katsu is Japanese-style fried chicken. This is my family recipe and can also be used to make tonkatsu by using pork cutlets instead of chicken. Serve with white rice and tonkatsu sauce",
    images: [],
    rating: 124,
    portions: 4,
    cookTime: "1h",
    difficulty: 3,
    sideNotes: "Probajte dodati malo jabuke i tamne cokolade",
    ingredients: {
      "a1b2c3d4-0000-0000-0000-000000000001": {
        id: "a1b2c3d4-0000-0000-0000-000000000001",
        name: "Špageti",
        amount: 400,
        measuringUnit: "g",
        index: 0,
      },
      "a1b2c3d4-0000-0000-0000-000000000002": {
        id: "a1b2c3d4-0000-0000-0000-000000000002",
        name: "Panceta",
        amount: 200,
        measuringUnit: "g",
        index: 1,
      },
      "a1b2c3d4-0000-0000-0000-000000000003": {
        id: "a1b2c3d4-0000-0000-0000-000000000003",
        name: "Jaja",
        amount: 4,
        measuringUnit: "kom",
        index: 2,
      },
      "a1b2c3d4-0000-0000-0000-000000000004": {
        id: "a1b2c3d4-0000-0000-0000-000000000004",
        name: "Parmezan",
        amount: 100,
        measuringUnit: "g",
        index: 3,
      },
      "a1b2c3d4-0000-0000-0000-000000000005": {
        id: "a1b2c3d4-0000-0000-0000-000000000005",
        name: "Crni papar",
        amount: 1,
        measuringUnit: "žličica",
        index: 4,
      },
    },
    instructions: {
      "b2c3d4e5-0000-0000-0000-000000000001": {
        id: "b2c3d4e5-0000-0000-0000-000000000001",
        name: "Kuhanje paste",
        text: "Zakuhaj veliku količinu posoljene vode i kuhaj špagete prema uputama na pakiranju do al dente.",
        index: 0,
        images: [],
      },
      "b2c3d4e5-0000-0000-0000-000000000002": {
        id: "b2c3d4e5-0000-0000-0000-000000000002",
        name: "Prženje pancete",
        text: "Izreži pancetu na kockice i prži na tavi bez ulja dok ne postane hrskava.",
        index: 1,
        images: [],
      },
      "b2c3d4e5-0000-0000-0000-000000000003": {
        id: "b2c3d4e5-0000-0000-0000-000000000003",
        name: "Priprema umaka",
        text: "U zdjeli umutiti jaja s ribanim parmezanom i obilno popapriti.",
        index: 2,
        images: [],
      },
      "b2c3d4e5-0000-0000-0000-000000000004": {
        id: "b2c3d4e5-0000-0000-0000-000000000004",
        name: "Spajanje",
        text: "Ocijedi pastu i odmah je dodaj na tavu s pancetom. Makni s vatre i dodaj mješavinu jaja i parmezana. Miješaj brzo dodajući malo vode od kuhanja paste dok umak ne postane kremast.",
        index: 3,
        images: [],
      },
    },
    ingredientsOrder: [
      "a1b2c3d4-0000-0000-0000-000000000001",
      "a1b2c3d4-0000-0000-0000-000000000002",
      "a1b2c3d4-0000-0000-0000-000000000003",
      "a1b2c3d4-0000-0000-0000-000000000004",
      "a1b2c3d4-0000-0000-0000-000000000005",
    ],
    instructionsOrder: [
      "b2c3d4e5-0000-0000-0000-000000000001",
      "b2c3d4e5-0000-0000-0000-000000000002",
      "b2c3d4e5-0000-0000-0000-000000000003",
      "b2c3d4e5-0000-0000-0000-000000000004",
    ],
  };
}
