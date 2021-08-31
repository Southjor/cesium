vec2 computeSt(float featureId)
{
    float stepX = model_textureStep.x;
    float centerX = model_textureStep.y;

    #ifdef MULTILINE_BATCH_TEXTURE
    float stepY = model_textureStep.z;
    float centerY = model_textureStep.w;

    float xId = mod(featureId, model_textureDimensions.x); 
    float yId = floor(featureId / model_textureDimensions.x);
    
    return vec2(centerX + (xId * stepX), centerY + (yId * stepY));
    #else
    return vec2(centerX + (featureId * stepX), 0.5);
    #endif
}

vec3 featureStage(vec3 position)
{
    float featureId;

    #ifdef FEATURE_ID_TEXTURE
    featureId = floor(texture2D(FEATURE_ID_TEXTURE, FEATURE_ID_TEXCOORD).FEATURE_ID_CHANNEL * 255.0 + 0.5);
    #else
    featureId = FEATURE_ID_ATTRIBUTE
    #endif

    if (featureId < model_featuresLength)
    {
        model_featureSt = computeSt(featureId);
    }

    return position;
}