import { Metadata3DTilesExtension } from "../../Source/Cesium.js";
import MetadataSchema from "../../Source/Scene/MetadataSchema.js";

describe("Scene/Metadata3DTilesExtension", function () {
  it("creates 3D Tiles metadata with default values", function () {
    var metadata = new Metadata3DTilesExtension({
      extension: {},
    });

    expect(metadata.schema).toBeUndefined();
    expect(metadata.groups).toEqual({});
    expect(metadata.tileset).toBeUndefined();
    expect(metadata.statistics).toBeUndefined();
    expect(metadata.extras).toBeUndefined();
    expect(metadata.extensions).toBeUndefined();
  });

  var schema = {
    classes: {
      city: {
        properties: {
          name: {
            type: "STRING",
          },
        },
      },
      neighborhood: {
        properties: {
          color: {
            type: "STRING",
          },
        },
      },
      tree: {
        properties: {
          species: {
            type: "STRING",
          },
        },
      },
    },
  };

  it("creates 3D Tiles metadata", function () {
    var statistics = {
      classes: {
        tree: {
          count: 100,
          properties: {
            height: {
              min: [10.0],
              max: [20.0],
            },
          },
        },
      },
    };

    var extras = {
      description: "Extra",
    };

    var extensions = {
      EXT_other_extension: {},
    };

    var extension = {
      schema: schema,
      groups: {
        neighborhoodA: {
          class: "neighborhood",
          properties: {
            color: "RED",
          },
        },
        neighborhoodB: {
          class: "neighborhood",
          properties: {
            color: "GREEN",
          },
        },
      },
      tileset: {
        class: "city",
        properties: {
          name: "City",
        },
      },
      statistics: statistics,
      extras: extras,
      extensions: extensions,
    };

    var metadata = new Metadata3DTilesExtension({
      extension: extension,
    });

    var cityClass = metadata.schema.classes.city;
    var neighborhoodClass = metadata.schema.classes.neighborhood;
    var treeClass = metadata.schema.classes.tree;

    expect(cityClass.id).toBe("city");
    expect(neighborhoodClass.id).toBe("neighborhood");
    expect(treeClass.id).toBe("tree");

    var tilesetMetadata = metadata.tileset;
    expect(tilesetMetadata.class).toBe(cityClass);
    expect(tilesetMetadata.properties.name).toBe("City");

    var neighborhoodA = metadata.groups.neighborhoodA;
    var neighborhoodB = metadata.groups.neighborhoodB;

    expect(neighborhoodA.class).toBe(neighborhoodClass);
    expect(neighborhoodA.properties.color).toBe("RED");
    expect(neighborhoodB.class).toBe(neighborhoodClass);
    expect(neighborhoodB.properties.color).toBe("GREEN");

    expect(metadata.statistics).toBe(statistics);
    expect(metadata.extras).toBe(extras);
    expect(metadata.extensions).toBe(extensions);
  });

  it("creates 3D Tiles metadata with external schema", function () {
    var extension = {
      schemaUri: "schema.json",
    };

    var metadata = new Metadata3DTilesExtension({
      extension: extension,
      externalSchema: new MetadataSchema(schema),
    });

    var cityClass = metadata.schema.classes.city;
    var neighborhoodClass = metadata.schema.classes.neighborhood;
    var treeClass = metadata.schema.classes.tree;

    expect(cityClass.id).toBe("city");
    expect(neighborhoodClass.id).toBe("neighborhood");
    expect(treeClass.id).toBe("tree");
  });

  it("constructor throws without extension", function () {
    expect(function () {
      return new Metadata3DTilesExtension();
    }).toThrowDeveloperError();
  });
});
