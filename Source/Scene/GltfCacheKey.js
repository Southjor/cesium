import Check from "../Core/Check.js";
import defaultValue from "../Core/defaultValue.js";
import defined from "../Core/defined.js";
import getAbsoluteUri from "../Core/getAbsoluteUri.js";
import GltfLoaderUtil from "./GltfLoaderUtil.js";

/**
 * Gets cache keys for {@link GltfCacheResource}.
 *
 * @namespace GltfCacheKey
 *
 * @private
 */
var GltfCacheKey = {};

function getExternalResourceCacheKey(baseResource, uri) {
  var resource = baseResource.getDerivedResource({
    url: uri,
  });
  return getAbsoluteUri(resource.url);
}

function getEmbeddedBufferCacheKey(gltfCacheKey, bufferId) {
  return gltfCacheKey + "-buffer-" + bufferId;
}

function getBufferViewCacheKey(bufferView) {
  var byteOffset = bufferView.byteOffset;
  var byteLength = bufferView.byteLength;
  return byteOffset + "-" + byteLength;
}

function getAccessorCacheKey(accessor, bufferView) {
  var byteOffset = bufferView.byteOffset + accessor.byteOffset;
  var componentType = accessor.componentType;
  var type = accessor.type;
  var count = accessor.count;
  return byteOffset + "-" + componentType + "-" + type + "-" + count;
}

/**
 * Gets the glTF cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Resource} options.gltfResource The {@link Resource} pointing to the glTF file.
 *
 * @returns {String} The glTF cache key.
 */
GltfCacheKey.getGltfCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var gltfResource = options.gltfResource;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.gltfResource", gltfResource);
  //>>includeEnd('debug');

  return getAbsoluteUri(gltfResource.url);
};

/**
 * Gets the buffer cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} options.buffer The glTF buffer.
 * @param {Number} options.bufferId The buffer ID.
 * @param {Resource} options.gltfResource The {@link Resource} pointing to the glTF file.
 * @param {Resource} options.baseResource The {@link Resource} that paths in the glTF JSON are relative to.
 *
 * @returns {String} The buffer cache key.
 */
GltfCacheKey.getBufferCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var buffer = options.buffer;
  var bufferId = options.bufferId;
  var gltfResource = options.gltfResource;
  var baseResource = options.baseResource;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.buffer", buffer);
  Check.typeOf.number("options.bufferId", bufferId);
  Check.typeOf.object("options.gltfResource", gltfResource);
  Check.typeOf.object("options.baseResource", baseResource);
  //>>includeEnd('debug');

  if (defined(buffer.uri)) {
    return getExternalResourceCacheKey(baseResource, buffer.uri);
  }
  var gltfCacheKey = GltfCacheKey.getGltfCacheKey({
    gltfResource: gltfResource,
  });
  return getEmbeddedBufferCacheKey(gltfCacheKey, bufferId);
};

/**
 * Gets the vertex buffer cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} options.gltf The glTF JSON.
 * @param {Number} options.bufferViewId The bufferView ID corresponding to the vertex buffer.
 * @param {Resource} options.gltfResource The {@link Resource} pointing to the glTF file.
 * @param {Resource} options.baseResource The {@link Resource} that paths in the glTF JSON are relative to.
 *
 * @returns {String} The vertex buffer cache key.
 */
GltfCacheKey.getVertexBufferCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var gltf = options.gltf;
  var bufferViewId = options.bufferViewId;
  var gltfResource = options.gltfResource;
  var baseResource = options.baseResource;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.gltf", gltf);
  Check.typeOf.number("options.bufferViewId", bufferViewId);
  Check.typeOf.object("options.gltfResource", gltfResource);
  Check.typeOf.object("options.baseResource", baseResource);
  //>>includeEnd('debug');

  var bufferView = gltf.bufferViews[bufferViewId];
  var bufferId = bufferView.buffer;
  var buffer = gltf.buffers[bufferId];

  var bufferCacheKey = GltfCacheKey.getBufferCacheKey({
    buffer: buffer,
    bufferId: bufferId,
    gltfResource: gltfResource,
    baseResource: baseResource,
  });

  var bufferViewCacheKey = getBufferViewCacheKey(bufferView);

  return bufferCacheKey + "-vertex-buffer-" + bufferViewCacheKey;
};

/**
 * Gets the index buffer cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} options.gltf The glTF JSON.
 * @param {Number} options.accessorId The accessor ID corresponding to the index buffer.
 * @param {Resource} options.gltfResource The {@link Resource} pointing to the glTF file.
 * @param {Resource} options.baseResource The {@link Resource} that paths in the glTF JSON are relative to.
 *
 * @returns {String} The index buffer cache key.
 */
GltfCacheKey.getIndexBufferCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var gltf = options.gltf;
  var accessorId = options.accessorId;
  var gltfResource = options.gltfResource;
  var baseResource = options.baseResource;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.gltf", gltf);
  Check.typeOf.number("options.accessorId", accessorId);
  Check.typeOf.object("options.gltfResource", gltfResource);
  Check.typeOf.object("options.baseResource", baseResource);
  //>>includeEnd('debug');

  var accessor = gltf.accessors[accessorId];
  var bufferViewId = accessor.bufferView;
  var bufferView = gltf.bufferViews[bufferViewId];
  var bufferId = bufferView.buffer;
  var buffer = gltf.buffers[bufferId];

  var bufferCacheKey = GltfCacheKey.getBufferCacheKey({
    buffer: buffer,
    bufferId: bufferId,
    gltfResource: gltfResource,
    baseResource: baseResource,
  });

  var accessorCacheKey = getAccessorCacheKey(accessor, bufferView);

  return bufferCacheKey + "-index-buffer-" + accessorCacheKey;
};

/**
 * Gets the Draco vertex buffer cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} options.gltf The glTF JSON.
 * @param {Number} options.bufferViewId The bufferView ID corresponding to the Draco buffer.
 * @param {Number} options.dracoAttributeId The Draco attribute ID.
 * @param {Resource} options.gltfResource The {@link Resource} pointing to the glTF file.
 * @param {Resource} options.baseResource The {@link Resource} that paths in the glTF JSON are relative to.
 *
 * @returns {String} The Draco vertex buffer cache key.
 */
GltfCacheKey.getDracoVertexBufferCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var gltf = options.gltf;
  var bufferViewId = options.bufferViewId;
  var dracoAttributeId = options.dracoAttributeId;
  var gltfResource = options.gltfResource;
  var baseResource = options.baseResource;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.gltf", gltf);
  Check.typeOf.number("options.bufferViewId", bufferViewId);
  Check.typeOf.number("options.dracoAttributeId", dracoAttributeId);
  Check.typeOf.object("options.gltfResource", gltfResource);
  Check.typeOf.object("options.baseResource", baseResource);
  //>>includeEnd('debug');

  var bufferView = gltf.bufferViews[bufferViewId];
  var bufferId = bufferView.buffer;
  var buffer = gltf.buffers[bufferId];

  var bufferCacheKey = GltfCacheKey.getBufferCacheKey({
    buffer: buffer,
    bufferId: bufferId,
    gltfResource: gltfResource,
    baseResource: baseResource,
  });

  var bufferViewCacheKey = getBufferViewCacheKey(bufferView);

  var dracoCacheKey = dracoAttributeId;

  return (
    bufferCacheKey +
    "-draco-vertex-buffer-" +
    bufferViewCacheKey +
    "-" +
    dracoCacheKey
  );
};

/**
 * Gets the image cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} options.gltf The glTF JSON.
 * @param {Number} options.imageId The image ID.
 * @param {Resource} options.gltfResource The {@link Resource} pointing to the glTF file.
 * @param {Resource} options.baseResource The {@link Resource} that paths in the glTF JSON are relative to.
 *
 * @returns {String} The image cache key.
 */
GltfCacheKey.getImageCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var gltf = options.gltf;
  var imageId = options.imageId;
  var gltfResource = options.gltfResource;
  var baseResource = options.baseResource;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.gltf", gltf);
  Check.typeOf.number("options.imageId", imageId);
  Check.typeOf.object("options.gltfResource", gltfResource);
  Check.typeOf.object("options.baseResource", baseResource);
  //>>includeEnd('debug');

  var image = gltf.images[imageId];

  if (defined(image.uri)) {
    return getExternalResourceCacheKey(baseResource, image.uri);
  }

  var bufferViewId = image.bufferView;
  var bufferView = gltf.bufferViews[bufferViewId];
  var bufferId = bufferView.buffer;
  var buffer = gltf.buffers[bufferId];

  var bufferCacheKey = GltfCacheKey.getBufferCacheKey({
    buffer: buffer,
    bufferId: bufferId,
    gltfResource: gltfResource,
    baseResource: baseResource,
  });

  var bufferViewCacheKey = getBufferViewCacheKey(bufferView);

  return bufferCacheKey + "-image-" + bufferViewCacheKey;
};

/**
 * Gets the sampler cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} options.gltf The glTF JSON.
 * @param {Object} options.textureInfo The texture info object.
 *
 * @returns {String} The sampler cache key.
 */
GltfCacheKey.getSamplerCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var gltf = options.gltf;
  var textureInfo = options.textureInfo;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.gltf", gltf);
  Check.typeOf.object("options.textureInfo", textureInfo);
  //>>includeEnd('debug');

  var sampler = GltfLoaderUtil.createSampler({
    gltf: gltf,
    textureInfo: textureInfo,
  });

  return (
    sampler.wrapS +
    "-" +
    sampler.wrapT +
    "-" +
    sampler.minificationFilter +
    "-" +
    sampler.magnificationFilter
  );
};

/**
 * Gets the texture cache key.
 *
 * @param {Object} options Object with the following properties:
 * @param {Object} options.gltf The glTF JSON.
 * @param {Object} options.textureInfo The texture info object.
 * @param {Resource} options.gltfResource The {@link Resource} pointing to the glTF file.
 * @param {Resource} options.baseResource The {@link Resource} that paths in the glTF JSON are relative to.
 * @param {Object.<String, Boolean>} options.supportedImageFormats The supported image formats.
 * @param {Boolean} options.supportedImageFormats.webp Whether the browser supports WebP images.
 * @param {Boolean} options.supportedImageFormats.s3tc Whether the browser supports s3tc compressed images.
 * @param {Boolean} options.supportedImageFormats.pvrtc Whether the browser supports pvrtc compressed images.
 * @param {Boolean} options.supportedImageFormats.etc1 Whether the browser supports etc1 compressed images.
 *
 * @returns {String} The texture cache key.
 */
GltfCacheKey.getTextureCacheKey = function (options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  var gltf = options.gltf;
  var textureInfo = options.textureInfo;
  var gltfResource = options.gltfResource;
  var baseResource = options.baseResource;
  var supportedImageFormats = defaultValue(
    options.supportedImageFormats,
    defaultValue.EMPTY_OBJECT
  );
  var supportsWebP = supportedImageFormats.webp;
  var supportsS3tc = supportedImageFormats.s3tc;
  var supportsPvrtc = supportedImageFormats.pvrtc;
  var supportsEtc1 = supportedImageFormats.etc1;

  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.object("options.gltf", gltf);
  Check.typeOf.object("options.textureInfo", textureInfo);
  Check.typeOf.object("options.gltfResource", gltfResource);
  Check.typeOf.object("options.baseResource", baseResource);
  Check.typeOf.boolean("options.supportedImageFormats.webp", supportsWebP);
  Check.typeOf.boolean("options.supportedImageFormats.s3tc", supportsS3tc);
  Check.typeOf.boolean("options.supportedImageFormats.pvrtc", supportsPvrtc);
  Check.typeOf.boolean("options.supportedImageFormats.etc1", supportsEtc1);
  //>>includeEnd('debug');

  var textureId = textureInfo.index;

  var imageId = GltfLoaderUtil.getImageIdFromTexture({
    gltf: gltf,
    textureId: textureId,
    supportedImageFormats: supportedImageFormats,
  });

  // TODO: imageId may not be defined

  var imageCacheKey = GltfCacheKey.getImageCacheKey({
    gltf: gltf,
    imageId: imageId,
    gltfResource: gltfResource,
    baseResource: baseResource,
  });

  // Include the sampler cache key in the texture cache key since textures and
  // samplers are coupled in WebGL 1. When upgrading to WebGL 2 consider
  // removing the sampleCacheKey here and in GltfLoader#getTextureInfoKey
  var samplerCacheKey = GltfCacheKey.getSamplerCacheKey({
    gltf: gltf,
    textureInfo: textureInfo,
  });

  return imageCacheKey + "-texture-" + samplerCacheKey;
};

export default GltfCacheKey;