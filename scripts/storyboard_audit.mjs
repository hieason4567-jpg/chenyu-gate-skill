// 自动生成，勿手改。来源: E:/pump2.0 services/utils.ts parseTaskIntoShots + storyboardReferenceLock.ts + episodeAssetAuthority.ts（2026-10-01T06:54:37.783Z）
// 重新生成: node E:/pump2.0/scripts/export-skill-storyboard-audit.mjs
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// node_modules/cmu-pronouncing-dictionary/index.js
var init_cmu_pronouncing_dictionary = __esm({
  "node_modules/cmu-pronouncing-dictionary/index.js"() {
  }
});

// services/characterAgeIndex.ts
var init_characterAgeIndex = __esm({
  "services/characterAgeIndex.ts"() {
  }
});

// services/characterRegistry.ts
var BRACKET_TRIM_PATTERN, NAME_SPLIT_PATTERN, STATE_INPUT_SPLIT_PATTERN, STATE_METADATA_KEY_PATTERN_SOURCE, STATE_METADATA_KEY_PATTERN, STATE_METADATA_KEY_VALUE_PATTERN, stripCharacterStateMetadataNoise, normalizeCharacterRegistryName, dedupeCharacterNameStateSuffix, normalizeCharacterStateInput;
var init_characterRegistry = __esm({
  "services/characterRegistry.ts"() {
    init_characterAgeIndex();
    BRACKET_TRIM_PATTERN = /^\[|\]$/g;
    NAME_SPLIT_PATTERN = /[-/\u2013\u2014]+/;
    STATE_INPUT_SPLIT_PATTERN = /[\/,\uFF0C;\uFF1B+]+/;
    STATE_METADATA_KEY_PATTERN_SOURCE = String.raw`(?:\b(?:identityKey|identity_key|identity|entityId|entity_id|stateId|state_id|roleKey|role_key|assetKey|asset_key|baseCharacterName|base_character_tag|parentCharacterName|parent_character|isPrimaryState|is_primary_state)\b|\u8eab\u4efd\u952e|\u4e3b\u72b6\u6001)`;
    STATE_METADATA_KEY_PATTERN = new RegExp(STATE_METADATA_KEY_PATTERN_SOURCE, "gi");
    STATE_METADATA_KEY_VALUE_PATTERN = new RegExp(`${STATE_METADATA_KEY_PATTERN_SOURCE}\\s*[:\\uFF1A]\\s*[^\\/,\uFF0C;\uFF1B+|\\uFF5C]*`, "gi");
    stripCharacterStateMetadataNoise = (raw) => String(raw || "").replace(STATE_METADATA_KEY_VALUE_PATTERN, "").replace(STATE_METADATA_KEY_PATTERN, "").replace(/\s+/g, " ").trim();
    normalizeCharacterRegistryName = (value) => {
      const normalized = String(value || "").trim().replace(BRACKET_TRIM_PATTERN, "").replace(/\s+/g, " ").trim();
      if (!normalized) return "";
      const parts = normalized.split(NAME_SPLIT_PATTERN).map((part) => part.trim()).filter(Boolean);
      if (parts.length <= 1) return normalized;
      const dedupedSuffixParts = [];
      const seenSuffixes = /* @__PURE__ */ new Set();
      parts.slice(1).forEach((part) => {
        const cleanedPart = stripCharacterStateMetadataNoise(part);
        const key = String(cleanedPart || "").replace(BRACKET_TRIM_PATTERN, "").replace(/['"`\u2018\u2019\u201C\u201D]/g, "").replace(/\s+/g, "").toLowerCase() || normalizeCharacterStateInput(cleanedPart).replace(/\s+/g, "").toLowerCase();
        if (!key || seenSuffixes.has(key)) return;
        seenSuffixes.add(key);
        dedupedSuffixParts.push(cleanedPart);
      });
      return [parts[0], ...dedupedSuffixParts].join("-").trim();
    };
    dedupeCharacterNameStateSuffix = (value) => {
      return normalizeCharacterRegistryName(value);
    };
    normalizeCharacterStateInput = (raw) => {
      const compact = stripCharacterStateMetadataNoise(String(raw || "")).replace(/\s+/g, " ").trim();
      if (!compact) return "";
      const states = compact.split(STATE_INPUT_SPLIT_PATTERN).map((part) => part.trim()).filter(Boolean);
      return states[0] || compact;
    };
  }
});

// services/assetPromptQuality.ts
var init_assetPromptQuality = __esm({
  "services/assetPromptQuality.ts"() {
  }
});

// services/locationStyleCard.ts
var init_locationStyleCard = __esm({
  "services/locationStyleCard.ts"() {
  }
});

// services/voiceCueFormatter.ts
var init_voiceCueFormatter = __esm({
  "services/voiceCueFormatter.ts"() {
  }
});

// services/voiceOnlyAssets.ts
var stripAssetBrackets, normalizeVoiceAssetKey, NARRATION_VOICE_KEYS, SYSTEM_VOICE_KEYS, SYSTEM_VOICE_CHARACTER_TAG, isGenericNarrationVoiceKey, isNarrationVoiceMarkerTag, isSystemVoiceSpeakerTag, REMOTE_VOICE_ONLY_LABEL_RE, REMOTE_VOICE_PREFIX_RE, REMOTE_VOICE_SUFFIX_RE, REMOTE_VOICE_SOURCE_RE, CARRIER_ONLY_KEY_RE, isRemoteOrRecordedVoiceOnlyTag, getSpeakerVoiceCanonicalTag, isVoiceOnlyPropSceneTag, getVoiceOnlyCharacterCanonicalTag;
var init_voiceOnlyAssets = __esm({
  "services/voiceOnlyAssets.ts"() {
    stripAssetBrackets = (value) => String(value || "").trim().replace(/^[\[\u3010]\s*/, "").replace(/\s*[\]\u3011]$/, "").trim();
    normalizeVoiceAssetKey = (value) => stripAssetBrackets(value).replace(/[\s_\-:：/\\().。．·]+/g, "").toLowerCase();
    NARRATION_VOICE_KEYS = /* @__PURE__ */ new Set([
      "vo",
      "ov",
      "os",
      "voiceover",
      "narrator",
      "narration",
      "\u65C1\u767D",
      "\u65C1\u767D\u97F3",
      "\u753B\u5916\u97F3",
      "\u5185\u5FC3os",
      "\u5185\u5FC3\u72EC\u767D",
      "\u89E3\u8BF4",
      "\u89E3\u8BF4\u97F3",
      "\u5E7F\u64AD",
      "\u5E7F\u64AD\u97F3",
      "\u5E7F\u64AD\u58F0",
      "\u5E7F\u64AD\u7537\u58F0",
      "\u5E7F\u64AD\u5973\u58F0",
      "\u8F66\u8F7D\u5E7F\u64AD",
      "\u8F66\u8F7D\u5E7F\u64AD\u58F0",
      "\u5E7F\u64AD\u901A\u77E5",
      "\u5E7F\u64AD\u64AD\u62A5"
    ]);
    SYSTEM_VOICE_KEYS = /* @__PURE__ */ new Set([
      "\u7CFB\u7EDF",
      "\u7CFB\u7EDF\u97F3",
      "\u7CFB\u7EDF\u58F0",
      "\u7CFB\u7EDF\u63D0\u793A",
      "\u7CFB\u7EDF\u63D0\u793A\u97F3",
      "\u7CFB\u7EDF\u64AD\u62A5"
    ]);
    SYSTEM_VOICE_CHARACTER_TAG = "[\u7CFB\u7EDF]";
    isGenericNarrationVoiceKey = (key) => /^(?:\u7537\u58f0|\u5973\u58f0|\u7ae5\u58f0)\d*$/u.test(key);
    isNarrationVoiceMarkerTag = (value) => NARRATION_VOICE_KEYS.has(normalizeVoiceAssetKey(value)) || isGenericNarrationVoiceKey(normalizeVoiceAssetKey(value));
    isSystemVoiceSpeakerTag = (value) => {
      if (SYSTEM_VOICE_KEYS.has(normalizeVoiceAssetKey(value))) return true;
      const stripped = stripAssetBrackets(value);
      const dashIdx = stripped.indexOf("-");
      if (dashIdx > 0) {
        const base = stripped.slice(0, dashIdx);
        if (base && SYSTEM_VOICE_KEYS.has(normalizeVoiceAssetKey(base))) return true;
      }
      return false;
    };
    REMOTE_VOICE_ONLY_LABEL_RE = /^(?:\u7535\u8bdd\u58f0|\u901a\u8bdd\u58f0|\u542c\u7b52\u58f0|\u5f55\u97f3|\u5f55\u97f3\u58f0|\u8bed\u97f3|\u8bed\u97f3\u6d88\u606f|\u5fae\u4fe1\u8bed\u97f3|\u8bed\u97f3\u7559\u8a00|\u7559\u8a00)$/u;
    REMOTE_VOICE_PREFIX_RE = /^(?:\u7535\u8bdd(?:\u90a3\u5934|\u91cc|\u4e2d)?(?:\u7684)?|\u624b\u673a(?:\u90a3\u5934|\u91cc|\u4e2d)?(?:\u7684)?|\u901a\u8bdd(?:\u4e2d)?(?:\u7684)?|\u542c\u7b52(?:\u91cc|\u4e2d)?(?:\u7684)?|\u5f55\u97f3(?:\u91cc|\u4e2d)?(?:\u7684)?|\u5f55\u97f3\u6587\u4ef6(?:\u91cc|\u4e2d)?(?:\u7684)?|\u8bed\u97f3(?:\u6d88\u606f)?(?:\u91cc|\u4e2d)?(?:\u7684)?|\u5fae\u4fe1\u8bed\u97f3(?:\u91cc|\u4e2d)?(?:\u7684)?|\u8bed\u97f3\u7559\u8a00(?:\u91cc|\u4e2d)?(?:\u7684)?)(.+)$/u;
    REMOTE_VOICE_SUFFIX_RE = /^(.+?)(?:\u7684)?(?:\u7535\u8bdd\u58f0|\u901a\u8bdd\u58f0|\u542c\u7b52\u58f0|\u624b\u673a\u58f0\u97f3|\u5f55\u97f3|\u5f55\u97f3\u58f0|\u8bed\u97f3|\u8bed\u97f3\u6d88\u606f|\u5fae\u4fe1\u8bed\u97f3|\u8bed\u97f3\u7559\u8a00|\u7559\u8a00)$/u;
    REMOTE_VOICE_SOURCE_RE = /(?:\u7535\u8bdd|\u624b\u673a|\u901a\u8bdd|\u542c\u7b52|\u5f55\u97f3|\u8bed\u97f3\u6d88\u606f|\u5fae\u4fe1\u8bed\u97f3|\u8bed\u97f3\u7559\u8a00|\u7559\u8a00)/u;
    CARRIER_ONLY_KEY_RE = /^(?:\u7535\u8bdd|\u624b\u673a|\u542c\u7b52|\u5f55\u97f3\u7b14|\u5f55\u97f3\u5668|\u5f55\u97f3\u6587\u4ef6)$/u;
    isRemoteOrRecordedVoiceOnlyTag = (value) => {
      const label = stripAssetBrackets(value).replace(/\s+/g, "");
      if (!label || CARRIER_ONLY_KEY_RE.test(label)) return false;
      if (REMOTE_VOICE_ONLY_LABEL_RE.test(label)) return true;
      const prefixMatch = label.match(REMOTE_VOICE_PREFIX_RE);
      if (prefixMatch && String(prefixMatch[1] || "").trim()) return true;
      const suffixMatch = label.match(REMOTE_VOICE_SUFFIX_RE);
      if (suffixMatch && String(suffixMatch[1] || "").trim()) return true;
      return REMOTE_VOICE_SOURCE_RE.test(label) && /\u58f0\u97f3$/u.test(label);
    };
    getSpeakerVoiceCanonicalTag = (value) => {
      const label = stripAssetBrackets(value).replace(/\s+/g, "");
      if (isRemoteOrRecordedVoiceOnlyTag(label)) return null;
      const match = label.match(/^(.+?)(?:\u7684)?\u58f0\u97f3$/u);
      if (!match) return void 0;
      const speaker = String(match[1] || "").trim();
      if (!speaker) return void 0;
      const speakerKey = normalizeVoiceAssetKey(speaker);
      if (NARRATION_VOICE_KEYS.has(speakerKey) || isGenericNarrationVoiceKey(speakerKey)) return null;
      if (SYSTEM_VOICE_KEYS.has(speakerKey)) return SYSTEM_VOICE_CHARACTER_TAG;
      return `[${speaker}]`;
    };
    isVoiceOnlyPropSceneTag = (value) => isNarrationVoiceMarkerTag(value) || isSystemVoiceSpeakerTag(value) || getSpeakerVoiceCanonicalTag(value) !== void 0;
    getVoiceOnlyCharacterCanonicalTag = (value) => {
      if (isNarrationVoiceMarkerTag(value)) return null;
      if (isSystemVoiceSpeakerTag(value)) return SYSTEM_VOICE_CHARACTER_TAG;
      return getSpeakerVoiceCanonicalTag(value);
    };
  }
});

// services/sourceDialogueGuard.ts
var unwrapStructuredSpeakerBrackets, STRUCTURED_SPEAKER_OPEN_FOR_CLOSE, STRUCTURED_SPEAKER_OPENERS, findStructuredTrailingBracketBlock, peelStructuredTrailingSpeakerCues, splitStructuredDialogueSpeaker;
var init_sourceDialogueGuard = __esm({
  "services/sourceDialogueGuard.ts"() {
    unwrapStructuredSpeakerBrackets = (rawValue) => {
      const value = String(rawValue || "").trim();
      const wrapped = value.match(/^\[([^\]\n]+)\]$/u) || value.match(/^\u3010([^\u3011\n]+)\u3011$/u);
      return String(wrapped?.[1] || value).trim();
    };
    STRUCTURED_SPEAKER_OPEN_FOR_CLOSE = {
      ")": "(",
      "\uFF09": "\uFF08",
      "]": "[",
      "\u3011": "\u3010"
    };
    STRUCTURED_SPEAKER_OPENERS = new Set(Object.values(STRUCTURED_SPEAKER_OPEN_FOR_CLOSE));
    findStructuredTrailingBracketBlock = (rawValue) => {
      const value = String(rawValue || "").trimEnd();
      if (!value) return null;
      const closer = value[value.length - 1] || "";
      const opener = STRUCTURED_SPEAKER_OPEN_FOR_CLOSE[closer];
      if (!opener) return null;
      const expectedOpeners = [opener];
      for (let index = value.length - 2; index >= 0; index -= 1) {
        const char = value[index] || "";
        const nestedOpener = STRUCTURED_SPEAKER_OPEN_FOR_CLOSE[char];
        if (nestedOpener) {
          expectedOpeners.push(nestedOpener);
          continue;
        }
        if (char === expectedOpeners[expectedOpeners.length - 1]) {
          expectedOpeners.pop();
          if (expectedOpeners.length === 0) {
            return {
              start: index,
              opener: char,
              content: value.slice(index + 1, value.length - 1).trim()
            };
          }
          continue;
        }
        if (STRUCTURED_SPEAKER_OPENERS.has(char)) return null;
      }
      return null;
    };
    peelStructuredTrailingSpeakerCues = (rawValue, preserveStandaloneRoleWrapper) => {
      let remaining = String(rawValue || "").trim();
      const cues = [];
      let peeledCount = 0;
      for (let pass = 0; pass < 8 && remaining; pass += 1) {
        const block = findStructuredTrailingBracketBlock(remaining);
        if (!block) break;
        const isStandaloneRoleWrapper = block.start === 0 && (block.opener === "[" || block.opener === "\u3010");
        if (preserveStandaloneRoleWrapper && isStandaloneRoleWrapper) break;
        remaining = remaining.slice(0, block.start).trim();
        if (block.content) cues.unshift(block.content);
        peeledCount += 1;
      }
      return { remaining, cues, peeledCount };
    };
    splitStructuredDialogueSpeaker = (rawValue) => {
      const outer = peelStructuredTrailingSpeakerCues(rawValue, true);
      let speakerToken = outer.remaining;
      let innerCues = [];
      let innerPeeledCount = 0;
      const roleWrapper = findStructuredTrailingBracketBlock(speakerToken);
      if (roleWrapper?.start === 0 && (roleWrapper.opener === "[" || roleWrapper.opener === "\u3010")) {
        const inner = peelStructuredTrailingSpeakerCues(roleWrapper.content, true);
        innerCues = inner.cues;
        innerPeeledCount = inner.peeledCount;
        if (inner.peeledCount > 0) {
          const closer = roleWrapper.opener === "[" ? "]" : "\u3011";
          speakerToken = inner.remaining ? `${roleWrapper.opener}${inner.remaining}${closer}` : "";
        }
      }
      return {
        speaker: unwrapStructuredSpeakerBrackets(speakerToken),
        speakerToken,
        cues: [...innerCues, ...outer.cues],
        hasTrailingCue: outer.peeledCount + innerPeeledCount > 0
      };
    };
  }
});

// services/assetTagFormatting.ts
var stripMarkdownDecorationsOutsideAssetTags;
var init_assetTagFormatting = __esm({
  "services/assetTagFormatting.ts"() {
    stripMarkdownDecorationsOutsideAssetTags = (text) => String(text || "").replace(
      /\[[^\[\]\r\n]+\]|【[^【】\r\n]+】|[*~_#]/g,
      (token) => token.startsWith("[") || token.startsWith("\u3010") ? token : ""
    );
  }
});

// services/dialogueSpeakerReferences.ts
var init_dialogueSpeakerReferences = __esm({
  "services/dialogueSpeakerReferences.ts"() {
  }
});

// services/structuredVisualReferences.ts
var init_structuredVisualReferences = __esm({
  "services/structuredVisualReferences.ts"() {
  }
});

// services/ownedDialogueBindings.ts
var init_ownedDialogueBindings = __esm({
  "services/ownedDialogueBindings.ts"() {
    init_structuredVisualReferences();
  }
});

// services/taskVisualBindings.ts
function rewriteTaskTagsPreservingQuotes(text, rename) {
  const closers = { "\u201C": "\u201D", "\u300C": "\u300D", '"': '"' };
  const stack = [];
  let output = "", start = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"' && text[index - 1] === "\\") continue;
    if (stack.length && char === stack[stack.length - 1]) {
      stack.pop();
      if (!stack.length) {
        output += text.slice(start, index + 1);
        start = index + 1;
      }
    } else if (closers[char]) {
      if (!stack.length) {
        output += rename(text.slice(start, index));
        start = index;
      }
      stack.push(closers[char]);
    }
  }
  return output + (stack.length ? text.slice(start) : rename(text.slice(start)));
}
var init_taskVisualBindings = __esm({
  "services/taskVisualBindings.ts"() {
    init_ownedDialogueBindings();
  }
});

// services/ffmpegService.ts
var init_ffmpegService = __esm({
  "services/ffmpegService.ts"() {
  }
});

// services/utils.ts
function isInvalidRecoveredDialogueSpeaker(value) {
  const normalized = normalizeEntityName(String(value || ""));
  if (!normalized) return true;
  if (isInvalidCharacterEntityName(normalized)) return true;
  if (/^(?:BEAT|SHOT)\d*$/i.test(normalized)) return true;
  if (/(?:\u573a\u666f|\u7a7a\u95f4|\u5730\u70b9|\u5ba4\u5185|\u5ba4\u5916|\u5ba2\u5385|\u5367\u5ba4|\u623f\u95f4|\u522b\u5885|\u5ead\u9662|\u95e8\u53e3|\u8d70\u5eca|\u5927\u5385|\u5bab\u6bbf|\u5b66\u6821|\u6559\u5ba4|\u533b\u9662|\u9152\u5e97|\u5de5\u5382|\u4ed3\u5e93|\u5c0f\u533a|\u8857\u9053|\u8def\u53e3|\u5ba2\u6808)/u.test(normalized)) return true;
  return false;
}
var unwrapBracketLikeToken, CAMERA_CUE_EXACT_NAMES, isLikelyCameraCueEntityName, stripCameraLikeDialogueSpeakerPrefix, stripNonVisualSpeakerCue, isStandaloneNonVisualSpeakerCue, isDurationOnlyToken, stripDurationOnlyDialoguePrefix, stripBareSpeechPrefixFromDialogue, stripInvalidEmptyDialogueSpeaker, compactDialogueLineForDedupe, dropDuplicateBareSpeechLines, normalizeDialogueSpeakerCues, sanitizeTag, normalizeCharactersInShotText, timeStringToSeconds, getDurationFromTimeRange, isNoDialogueText, SILENT_OR_EMPTY_SHOT_MIN_SECONDS, SILENT_OR_EMPTY_SHOT_MAX_SECONDS, isSilentOrEmptyShot, clampSilentOrEmptyShotDuration, normalizeSilentOrEmptyShotTime, cleanAIListArtifacts, ensureNonEmptyShotScene, isEmptyDialogueForActionRecovery, RECOVERED_DIALOGUE_SPEAKER_BLACKLIST_RE, cleanupRecoveredDialogueSpeaker, recoverDialogueFromActionText, recoverDialogueFromSfxText, SHOT_FIELD_MAP, SHOT_NON_MODEL_FIELDS, NON_VISUAL_SPEAKERS, normalizeEntityName, INVALID_CHARACTER_ENTITY_NAMES, isInvalidCharacterEntityName, extractBracketedNames, extractBareSpeakerNameFromDialoguePrefix, extractSpeakerNamesFromDialoguePrefix, mergeCharactersWithDialogueSpeakers, isExplicitNoCharacterFieldText, hasVisibleDialogueSpeakerInShotText, LEGACY_WORN_DECL_RE, stripLegacyWornPropDeclarations, parseLiteralBoundTaskShots, parseTaskIntoShots, parseDialogueForDubbing, NO_DIALOGUE_VALUE, stripDialogueCueMarkers, removeDialogueCueFromBeatAction, stripSplitShotBeatHeaders, VOICE_CUE_NAME_PATTERN, VOICE_CUE_COMPACT_PRESET_PATTERN, VOICE_CUE_INLINE_PATTERN, AUDIO_MARKER_REGEX, STRONG_LOOSE_VOICE_HINTS, LOOSE_VOICE_CUE_HINTS, SOURCE_APPEARANCE_FEATURE_TOKENS, fillMissingBeatDurations, serializeShotsToTaskScript;
var init_utils = __esm({
  "services/utils.ts"() {
    init_cmu_pronouncing_dictionary();
    init_characterRegistry();
    init_assetPromptQuality();
    init_locationStyleCard();
    init_voiceCueFormatter();
    init_voiceOnlyAssets();
    init_sourceDialogueGuard();
    init_assetTagFormatting();
    init_dialogueSpeakerReferences();
    init_taskVisualBindings();
    init_ownedDialogueBindings();
    init_ffmpegService();
    unwrapBracketLikeToken = (value) => String(value || "").replace(/^[\s\[\u3010]+|[\s\]\u3011]+$/g, "").trim();
    CAMERA_CUE_EXACT_NAMES = /* @__PURE__ */ new Set([
      "\u6B63\u9762\u673A\u4F4D",
      "\u4FA7\u9762\u673A\u4F4D",
      "\u80CC\u9762\u673A\u4F4D",
      "\u5E73\u89C6\u673A\u4F4D",
      "\u4F4E\u673A\u4F4D",
      "\u9AD8\u673A\u4F4D",
      "\u4FEF\u62CD",
      "\u4EF0\u62CD",
      "\u5E73\u89C6",
      "\u6B63\u53CD\u6253",
      "\u8FC7\u80A9",
      "\u7279\u5199",
      "\u8FD1\u666F",
      "\u4E2D\u666F",
      "\u5168\u666F",
      "\u8FDC\u666F",
      "\u5927\u7279\u5199",
      "\u6781\u7279\u5199",
      "\u4E3B\u89C2\u89C6\u89D2",
      "camera",
      "shot",
      "lens",
      "frame",
      "framing",
      "pov",
      "frontview",
      "sideview",
      "backview",
      "closeup",
      "closeupshot",
      "mediumshot",
      "wideshot",
      "longshot",
      "ots",
      "overtheshoulder"
    ]);
    isLikelyCameraCueEntityName = (value) => {
      const compact = unwrapBracketLikeToken(value).replace(/[\s_\-:\uFF1A,\uFF0C\u3001/|]+/g, "").toLowerCase();
      if (!compact) return false;
      if (/^(?:\u6444\u5f71\u5e08|\u6444\u50cf\u5e08|\u6444\u5f71\u52a9\u7406|\u6444\u50cf\u52a9\u7406|\u5bfc\u6f14)$/.test(compact)) return false;
      if (CAMERA_CUE_EXACT_NAMES.has(compact)) return true;
      if (/(?:\u673a\u4f4d|\u955c\u5934|\u6444\u5f71\u673a|\u6444\u50cf\u673a|\u8fd0\u955c|\u666f\u522b|\u89c6\u89d2|\u6784\u56fe|\u53d6\u666f|\u63a8\u955c|\u62c9\u955c|\u6447\u955c|\u79fb\u955c|\u8ddf\u62cd|\u4fef\u62cd|\u4ef0\u62cd|\u5e73\u89c6|\u8fc7\u80a9|\u6b63\u53cd\u6253|\u4e3b\u89c2\u89c6\u89d2)/u.test(compact)) return true;
      if (!/[\u4e00-\u9fff]/.test(compact) && /(?:camera|shot|lens|frame|view|pov|dolly|tracking|pan|tilt|zoom|handheld|steadicam)/i.test(compact)) return true;
      return false;
    };
    stripCameraLikeDialogueSpeakerPrefix = (value) => String(value || "").replace(/^\s*[\[\u3010]\s*([^\]\u3011\r\n]{1,40})\s*[\]\u3011]\s*(?:[\(\uFF08][^\)\uFF09\r\n]{0,80}[\)\uFF09])?\s*(?:(?:\u8bf4|\u8bf4\u9053|\u95ee|\u558a|\u4f4e\u58f0\u8bf4|\u8d28\u95ee|\u53cd\u95ee|\u54ed\u558a)\s*)?[:\uFF1A]?\s*/u, (match, name) => isLikelyCameraCueEntityName(String(name || "")) ? "" : match).trim();
    stripNonVisualSpeakerCue = (value) => splitStructuredDialogueSpeaker(String(value || "")).speakerToken.replace(/\s*[\(（]\s*(?:\u65c1\u767d|\u753b\u5916\u97f3|\u5185\u5fc3OS|\u5185\u5fc3\u72ec\u767d|OS|VO)\s*[\)）]\s*/gi, "").trim();
    isStandaloneNonVisualSpeakerCue = (value) => /^(?:\u65c1\u767d|\u753b\u5916\u97f3|\u5185\u5fc3OS|\u5185\u5fc3\u72ec\u767d|OS|VO)$/i.test(unwrapBracketLikeToken(String(value || "")).trim());
    isDurationOnlyToken = (value) => /^\d+(?:\.\d+)?\s*s$/i.test(unwrapBracketLikeToken(value).trim());
    stripDurationOnlyDialoguePrefix = (value) => String(value || "").replace(/^\s*[\[\u3010]\s*\d+(?:\.\d+)?\s*s\s*[\]\u3011]\s*(?=(?:\u7ee7\u7eed)?(?:\u8bf4|\u8bf4\u9053|\u95ee|\u95ee\u9053|\u558a|\u558a\u9053|\u56de\u5e94|\u8868\u793a)\s*[:\uFF1A])/iu, "").trim();
    stripBareSpeechPrefixFromDialogue = (value) => String(value || "").split(/\r?\n/).map((line) => String(line || "").replace(/^\s*(?:\u7ee7\u7eed)?(?:\u8bf4|\u8bf4\u9053)\s*[:\uFF1A]\s*(?=[“"「『])/u, "")).join("\n").trim();
    stripInvalidEmptyDialogueSpeaker = (value) => String(value || "").replace(/^\s*\u65e0\s*(?:\u8bf4|\u8bf4\u9053)\s*[:\uFF1A]\s*/u, "").trim();
    compactDialogueLineForDedupe = (value) => String(value || "").replace(/^\s*(?:\u7ee7\u7eed)?(?:\u8bf4|\u8bf4\u9053)\s*[:\uFF1A]\s*/u, "").replace(/[“”"「」『』\s]/g, "").trim();
    dropDuplicateBareSpeechLines = (value) => {
      const lines = String(value || "").split(/\r?\n/);
      const seen = /* @__PURE__ */ new Set();
      return lines.filter((line) => {
        const raw = String(line || "").trim();
        if (!raw) return false;
        const key = compactDialogueLineForDedupe(raw);
        const isBareSpeech = /^\s*(?:\u7ee7\u7eed)?(?:\u8bf4|\u8bf4\u9053)\s*[:\uFF1A]/u.test(raw);
        if (isBareSpeech && key && seen.has(key)) return false;
        if (key) seen.add(key);
        return true;
      }).join("\n");
    };
    normalizeDialogueSpeakerCues = (value) => stripInvalidEmptyDialogueSpeaker(stripBareSpeechPrefixFromDialogue(dropDuplicateBareSpeechLines(stripDurationOnlyDialoguePrefix(stripCameraLikeDialogueSpeakerPrefix(String(value || "")))))).replace(/[\[【]([^\]】\n]{1,40}?)[\(（]\s*((?:\u65c1\u767d|\u753b\u5916\u97f3|\u5185\u5fc3OS|\u5185\u5fc3\u72ec\u767d|OS|VO))\s*[\)）]\s*[\]】]/gi, (_match, name, cue) => {
      const base = stripNonVisualSpeakerCue(String(name || "").trim());
      return base ? `${sanitizeTag(base)}\uFF08${String(cue || "").trim()}\uFF09` : String(_match || "");
    }).replace(/[\[【]([^\]】\n]{1,40}?)[\]】]\s*[\[【]\s*((?:\u65c1\u767d|\u753b\u5916\u97f3|\u5185\u5fc3OS|\u5185\u5fc3\u72ec\u767d|OS|VO))\s*[\]】]/gi, (_match, name, cue) => {
      const base = stripNonVisualSpeakerCue(String(name || "").trim());
      return base ? `${sanitizeTag(base)}\uFF08${String(cue || "").trim()}\uFF09` : String(_match || "");
    }).replace(/[\[【]([^\]】\n]{1,40}?)[\]】]\s*[\(（]\s*((?:\u65c1\u767d|\u753b\u5916\u97f3|\u5185\u5fc3OS|\u5185\u5fc3\u72ec\u767d|OS|VO))\s*[\)）]/gi, (_match, name, cue) => {
      const base = stripNonVisualSpeakerCue(String(name || "").trim());
      return base ? `${sanitizeTag(base)}\uFF08${String(cue || "").trim()}\uFF09` : String(_match || "");
    });
    sanitizeTag = (tag) => {
      if (!tag) return "";
      let cleaned = tag.replace(/\[|\]/g, "").trim();
      return `[${cleaned}]`;
    };
    normalizeCharactersInShotText = (text) => {
      const source = String(text || "").trim();
      if (!source) return "";
      const dedupeTokens = (tokens) => {
        const seen = /* @__PURE__ */ new Set();
        return tokens.filter((token) => {
          const raw = String(token || "").trim();
          if (!raw) return false;
          const key = raw.replace(/^\[|\]$/g, "").trim();
          if (isDurationOnlyToken(key)) return false;
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      };
      const normalizeToken = (token) => {
        const raw = String(token || "").trim();
        if (!raw) return "";
        const hadBracket = /^\[.*\]$/.test(raw);
        const bare = stripNonVisualSpeakerCue(dedupeCharacterNameStateSuffix(raw.replace(/^\[|\]$/g, "").trim()));
        if (!bare) return "";
        if (isDurationOnlyToken(bare)) return "";
        if (isLikelyCameraCueEntityName(bare)) return "";
        return hadBracket ? sanitizeTag(bare) : bare;
      };
      const bracketNormalized = source.replace(/\[([^\]]+)\]/g, (_match, inner) => {
        const bare = stripNonVisualSpeakerCue(dedupeCharacterNameStateSuffix(String(inner || "").trim()));
        if (isDurationOnlyToken(bare)) return "";
        return bare && !isLikelyCameraCueEntityName(bare) ? sanitizeTag(bare) : "";
      });
      if (/[\u3001,\uFF0C]/.test(bracketNormalized)) {
        return dedupeTokens(
          bracketNormalized.split(/[\u3001,\uFF0C]/).map((segment) => normalizeToken(segment)).filter(Boolean)
        ).join(", ");
      }
      return dedupeTokens([normalizeToken(bracketNormalized)]).join(", ");
    };
    timeStringToSeconds = (timeStr) => {
      const clean = String(timeStr || "").toLowerCase().replace(/\u79d2/g, "s").trim();
      if (!clean) return 0;
      const firstLine = clean.split(/\r?\n/)[0].trim();
      const normalized = firstLine.replace(/s/g, "").trim();
      if (normalized.includes(":")) {
        const parts = normalized.split(":").map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      const numeric = normalized.match(/-?\d+(?:\.\d+)?/);
      return numeric ? parseFloat(numeric[0]) || 0 : 0;
    };
    getDurationFromTimeRange = (timeRange) => {
      const text = String(timeRange || "").trim();
      if (!text) return 0;
      const normalized = text.replace(/\u79d2/g, "s").replace(/[~\uFF5E\u81F3\u5230\u2013\u2014\uFF0D]/g, "-");
      const rangeMatch = normalized.match(/(-?\d+(?::\d{1,2}){1,2}(?:\.\d+)?|-?\d+(?:\.\d+)?)\s*s?\s*-\s*(-?\d+(?::\d{1,2}){1,2}(?:\.\d+)?|-?\d+(?:\.\d+)?)\s*s?/i);
      if (rangeMatch) {
        const start = timeStringToSeconds(rangeMatch[1]);
        const end = timeStringToSeconds(rangeMatch[2]);
        return Math.max(0, end - start);
      }
      return timeStringToSeconds(normalized);
    };
    isNoDialogueText = (text) => {
      const cleaned = (text || "").replace(/\s+/g, "").replace(/[。,.，!！?？]/g, "").trim();
      if (!cleaned) return true;
      const normalized = cleaned.toLowerCase();
      return [
        "\u65E0",
        "\u65E0\u5BF9\u767D",
        "\u65E0\u5BF9\u8BDD",
        "\u65E0\u53F0\u8BCD",
        "\u6682\u65E0",
        "\u65E0\u5185\u5BB9",
        "none",
        "null",
        "n/a",
        "na",
        "-",
        "\u2014"
      ].includes(normalized);
    };
    SILENT_OR_EMPTY_SHOT_MIN_SECONDS = 1.2;
    SILENT_OR_EMPTY_SHOT_MAX_SECONDS = 5;
    isSilentOrEmptyShot = (shot) => {
      if (!shot) return true;
      const dialogue = String(shot.dialogue || "").replace(/^(?:dialogue|对白|台词|对话)\s*[:：]\s*/i, "").trim();
      if (isNoDialogueText(dialogue)) return true;
      const characters = String(shot.charactersInShot || "").trim();
      const visualFields = [shot.scene, shot.action, shot.prompt, shot.FirstFrame, shot.LastFrame].map((value) => String(value || "").trim()).filter(Boolean);
      return isNoDialogueText(characters) && visualFields.length === 0;
    };
    clampSilentOrEmptyShotDuration = (duration, fallback = SILENT_OR_EMPTY_SHOT_MIN_SECONDS) => {
      const value = Number(duration);
      const safeValue = Number.isFinite(value) && value > 0 ? value : fallback;
      return Math.min(SILENT_OR_EMPTY_SHOT_MAX_SECONDS, Math.max(SILENT_OR_EMPTY_SHOT_MIN_SECONDS, safeValue));
    };
    normalizeSilentOrEmptyShotTime = (shot, rawTime) => {
      const sourceTime = String(rawTime ?? shot.time ?? "").replace(/\s*[~～]\s*/g, "-").trim();
      if (!isSilentOrEmptyShot(shot)) return sourceTime;
      if (!sourceTime) return `${SILENT_OR_EMPTY_SHOT_MIN_SECONDS.toFixed(1)}s`;
      if (/(?:~|-|\u81f3|\u5230)/.test(sourceTime)) return sourceTime;
      const duration = getDurationFromTimeRange(sourceTime);
      return `${clampSilentOrEmptyShotDuration(duration).toFixed(1)}s`;
    };
    cleanAIListArtifacts = (text) => {
      if (!text) return "";
      const safeResult = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0).filter((line) => !/^[\(\uff08]?\s*(?:\u89c6\u89c9|\u753b\u9762|\u955c\u5934|visual)[:\uff1a]/iu.test(line)).join("\n");
      if (safeResult || !String(text || "").trim()) return normalizeCharactersInShotText(safeResult);
      let clean = text.replace(/`/g, "").trim();
      if (clean === "\u65E0" || clean === "None") return "";
      if (clean.startsWith("[") && clean.endsWith("]")) {
        try {
          if (clean.includes('"') || clean.includes("'")) {
            if (clean.startsWith('["') || clean.startsWith("['")) {
              return clean.slice(1, -1).replace(/['"]/g, "");
            }
          }
        } catch (e) {
        }
      }
      return normalizeCharactersInShotText(clean);
    };
    ensureNonEmptyShotScene = (shot) => {
      return cleanAIListArtifacts(String(shot.scene || ""));
    };
    isEmptyDialogueForActionRecovery = (value) => {
      const text = String(value || "").trim();
      return !text || text === "\u65E0" || /^none$/i.test(text) || /^null$/i.test(text) || /^n\/a$/i.test(text);
    };
    RECOVERED_DIALOGUE_SPEAKER_BLACKLIST_RE = /^(?:\u8bf4|\u8bf4\u9053|\u5f00\u53e3|\u558a|\u5927\u558a|\u543c|\u6012\u543c|\u4f4e\u58f0\u8bf4|\u8d28\u95ee|\u8ffd\u95ee|\u53cd\u95ee|\u54ed\u558a|\u54fd\u54bd|\u54fd\u54bd\u7740\u8bf4|\u56de\u7b54|\u5e94\u58f0)$/;
    cleanupRecoveredDialogueSpeaker = (value) => {
      const text = String(value || "").replace(/^[\s\[\u3010]+|[\s\]\u3011]+$/g, "").replace(/[\uff08(][^\uff09)\r\n]{0,80}[\uff09)]/g, "").replace(/^(?:action|dialogue|prompt)\s*[:\uFF1A]\s*/i, "").trim();
      return text.slice(0, 40);
    };
    recoverDialogueFromActionText = (action) => {
      const source = String(action || "");
      if (!source.trim()) return "";
      const segments = [];
      const seen = /* @__PURE__ */ new Set();
      const pushRecovered = (speakerRaw, spokenRaw) => {
        const spoken = String(spokenRaw || "").replace(/\s+/g, " ").trim();
        const speaker2 = cleanupRecoveredDialogueSpeaker(speakerRaw);
        if (!speaker2 || !spoken || spoken === "\u65E0") return;
        if (RECOVERED_DIALOGUE_SPEAKER_BLACKLIST_RE.test(speaker2)) return;
        if (isInvalidRecoveredDialogueSpeaker(speaker2)) return;
        const key = `${speaker2}:${spoken}`;
        if (seen.has(key)) return;
        seen.add(key);
        segments.push(`${sanitizeTag(speaker2)}\u8BF4\uFF1A\u201C${spoken}\u201D`);
      };
      const quoted = String.raw`[\u201c"\u300c\u300e']([^\u201d"\u300d\u300f'\r\n]{1,180})[\u201d"\u300d\u300f']`;
      const speaker = String.raw`((?:\[[^\]\r\n]{1,40}\]|[\u4e00-\u9fffA-Za-z0-9_\u00b7]{1,24})(?:[\uff08(][^\uff09)\r\n]{0,80}[\uff09)])?)`;
      const speechVerb = String.raw`(?:\u8bf4|\u8bf4\u9053|\u5f00\u53e3|\u558a|\u5927\u558a|\u543c|\u6012\u543c|\u4f4e\u58f0\u8bf4|\u8d28\u95ee|\u8ffd\u95ee|\u53cd\u95ee|\u54ed\u558a|\u54fd\u54bd|\u56de\u7b54|\u5e94\u58f0|\u753b\u5916\u97f3|\u5185\u5fc3\u72ec\u767d|\u65c1\u767d|\u89e3\u8bf4)`;
      const patterns = [
        new RegExp(`${speaker}[^\\r\\n\\u201c"\\u300c\\u300e']{0,90}?${speechVerb}\\s*[:\\uFF1A]?\\s*${quoted}`, "gu")
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(source)) !== null) {
          pushRecovered(String(match[1] || ""), String(match[2] || ""));
        }
      }
      return segments.join("\n");
    };
    recoverDialogueFromSfxText = (sfx) => {
      const source = String(sfx || "");
      if (!source.trim()) return { dialogue: "", sfx: source };
      const voiceSpeaker = String.raw`(?:\u65c1\u767d|\u753b\u5916\u97f3|\u5185\u5fc3\u72ec\u767d|\u89e3\u8bf4|\u7cfb\u7edf\u63d0\u793a\u97f3|\u7cfb\u7edf\u63d0\u793a|\u7cfb\u7edf\u97f3|\u7cfb\u7edf|VO|OS)`;
      const quoted = String.raw`[\u201c"\u300c\u300e']([^\u201d"\u300d\u300f'\r\n]{1,240})[\u201d"\u300d\u300f']`;
      const patterns = [
        new RegExp(String.raw`\[(${voiceSpeaker})\](?:\s*(?:\u54cd\u8d77|\u8bf4|\u8bf4\u9053))?\s*[:\uFF1A]?\s*${quoted}`, "giu"),
        new RegExp(String.raw`(${voiceSpeaker})(?:\u58f0|\u97f3)?(?:\s*(?:\u54cd\u8d77|\u8bf4|\u8bf4\u9053))?\s*[:\uFF1A]?\s*${quoted}`, "giu")
      ];
      const segments = [];
      const seen = /* @__PURE__ */ new Set();
      const normalizeSpeaker = (speakerRaw) => {
        const speaker = String(speakerRaw || "").trim();
        if (/^vo$/i.test(speaker)) return "VO";
        if (/^os$/i.test(speaker)) return "OS";
        if (/^(?:\u7cfb\u7edf|\u7cfb\u7edf\u63d0\u793a|\u7cfb\u7edf\u97f3|\u7cfb\u7edf\u63d0\u793a\u97f3)$/u.test(speaker)) return "\u7CFB\u7EDF\u63D0\u793A\u97F3";
        return speaker;
      };
      const pushRecovered = (speakerRaw, spokenRaw) => {
        const speaker = normalizeSpeaker(speakerRaw);
        const spoken = String(spokenRaw || "").replace(/\s+/g, " ").trim();
        if (!speaker || !spoken || spoken === "\u65E0") return;
        const key = `${speaker}:${spoken}`;
        if (seen.has(key)) return;
        seen.add(key);
        segments.push(`${sanitizeTag(speaker)}\u8BF4\uFF1A\u201C${spoken}\u201D`);
      };
      let cleanedSfx = source;
      for (const pattern of patterns) {
        cleanedSfx = cleanedSfx.replace(pattern, (_match, speakerRaw, spokenRaw) => {
          const speaker = normalizeSpeaker(String(speakerRaw || ""));
          pushRecovered(String(speakerRaw || ""), String(spokenRaw || ""));
          return speaker ? /[\u58f0\u97f3]$/u.test(speaker) ? speaker : `${speaker}\u58F0` : "";
        });
      }
      cleanedSfx = cleanedSfx.replace(/\s+/g, " ").replace(/([,\uFF0C\u3001;\uFF1B])\s*([,\uFF0C\u3001;\uFF1B])/g, "$1").replace(/\s*[,\uFF0C\u3001;\uFF1B]\s*$/g, "").trim();
      return {
        dialogue: segments.join("\n"),
        sfx: cleanedSfx || "\u65E0"
      };
    };
    SHOT_FIELD_MAP = {
      "time": "time",
      "duration": "time",
      "\u65F6\u95F4": "time",
      "\u65F6\u957F": "time",
      "\u955C\u5934\u65F6\u957F": "time",
      "sourcerefs": "sourceRefs",
      "source_refs": "sourceRefs",
      "sourceref": "sourceRefs",
      "sourceids": "sourceRefs",
      "source_ids": "sourceRefs",
      "\u539F\u6587\u7F16\u53F7": "sourceRefs",
      "\u6765\u6E90\u7F16\u53F7": "sourceRefs",
      "\u955C\u5934\u89D2\u8272": "charactersInShot",
      "\u89D2\u8272": "charactersInShot",
      "\u4EBA\u7269": "charactersInShot",
      "\u955C\u5934\u4EBA\u7269": "charactersInShot",
      "characters": "charactersInShot",
      "character": "charactersInShot",
      "roles": "charactersInShot",
      "charactersinshot": "charactersInShot",
      "characters_in_shot": "charactersInShot",
      "characterinshot": "charactersInShot",
      "character_in_shot": "charactersInShot",
      "scene": "scene",
      "\u573A\u666F": "scene",
      "action": "action",
      "\u52A8\u4F5C": "action",
      "\u955C\u5934": "action",
      "\u955C\u5934\u63CF\u8FF0": "action",
      // 道具字段(2026-09-01): 必须在 startsWith('镜头') 的 action 兜底之前命中, 否则"镜头道具"会覆盖 action。
      "\u9053\u5177": "propsInShot",
      "\u955C\u5934\u9053\u5177": "propsInShot",
      "props": "propsInShot",
      "propsinshot": "propsInShot",
      "\u6A21\u677F\u6765\u6E90": "templateSource",
      "\u6A21\u677F\u7C7B\u578B": "templateSource",
      "\u955C\u5934\u6765\u6E90": "templateSource",
      "\u6A21\u677F": "templateSource",
      "template": "templateSource",
      "templatesource": "templateSource",
      "templateusage": "templateSource",
      "camera": "camera",
      "\u6444\u5F71\u673A": "camera",
      "\u8FD0\u955C": "camera",
      "lighting": "lighting",
      "\u5149\u7167": "lighting",
      "\u706F\u5149": "lighting",
      "dialogue": "dialogue",
      "\u5BF9\u767D": "dialogue",
      "\u53F0\u8BCD": "dialogue",
      "\u5BF9\u8BDD": "dialogue",
      "sfx": "sfx",
      "\u97F3\u6548": "sfx",
      "prompt": "prompt",
      "\u63D0\u793A\u8BCD": "prompt",
      "\u89C6\u9891\u63D0\u793A\u8BCD": "prompt",
      "\u89C6\u9891\u63CF\u8FF0\u8BCD": "prompt",
      "\u89C6\u9891\u63CF\u8FF0": "prompt",
      "\u89C6\u9891\u5185\u5BB9": "prompt",
      "firstframe": "FirstFrame",
      "first frame": "FirstFrame",
      "\u9996\u5E27": "FirstFrame",
      "lastframe": "LastFrame",
      "last frame": "LastFrame",
      "\u5C3E\u5E27": "LastFrame",
      "transitionprompt": "transitionPrompt",
      "\u8F6C\u573A\u63D0\u793A\u8BCD": "transitionPrompt"
    };
    SHOT_NON_MODEL_FIELDS = /* @__PURE__ */ new Set([
      "microtimeline",
      "micro_timeline",
      "\u5B50\u65F6\u95F4\u7EBF",
      "\u5FAE\u65F6\u95F4\u7EBF",
      "propmatch",
      "prop_match",
      "propsmatch",
      "\u9053\u5177\u5339\u914D"
    ]);
    NON_VISUAL_SPEAKERS = /* @__PURE__ */ new Set(["\u65C1\u767D", "\u753B\u5916\u97F3", "\u5185\u5FC3OS", "\u5185\u5FC3\u72EC\u767D", "\u7CFB\u7EDF", "\u7CFB\u7EDF\u97F3", "\u7CFB\u7EDF\u63D0\u793A", "\u7CFB\u7EDF\u63D0\u793A\u97F3", "OS", "VO", "OV"]);
    normalizeEntityName = (value) => (value || "").replace(/[\[\]\s]/g, "").trim();
    INVALID_CHARACTER_ENTITY_NAMES = /* @__PURE__ */ new Set([
      "",
      "\u672A\u77E5",
      "\u65E0",
      "none",
      "null",
      "n/a",
      "na",
      "\u89D2\u8272",
      "\u4EBA\u7269",
      "\u4E3B\u89D2",
      "\u914D\u89D2",
      "\u8EAB\u4EFD\u952E",
      "identity",
      "identitykey",
      "identity_key",
      "\u6807\u9898\u680F\u663E\u793A",
      "\u6807\u9898\u680F",
      "\u6807\u9898\u663E\u793A",
      "\u5C4F\u5E55\u6807\u9898",
      "\u5C4F\u5E55\u6587\u5B57",
      "\u753B\u9762\u6587\u5B57",
      "\u5B57\u5E55",
      "\u8425\u9500\u53F7",
      "\u8D26\u53F7",
      "\u7528\u6237\u540D",
      "\u5934\u50CF",
      "\u6635\u79F0",
      "\u6807\u9898\u9192\u76EE",
      "\u9192\u76EE\u6807\u9898",
      "\u6807\u9898\u6587\u5B57",
      "\u6807\u9898\u6587\u6848",
      "\u5B57\u5E55\u6587\u5B57",
      "\u5C4F\u5E55\u5B57\u5E55",
      "\u5F39\u5E55",
      "\u70ED\u641C\u6807\u9898",
      "\u65B0\u95FB\u6807\u9898",
      "\u6587\u5B57\u63D0\u793A",
      "\u63D0\u793A\u6587\u5B57",
      "\u58F0\u97F3\u59D4\u5C48",
      "\u58F0\u97F3\u54FD\u54BD",
      "\u58F0\u97F3\u98A4\u6296",
      "\u8BED\u6C14\u59D4\u5C48",
      "\u8BED\u6C14\u6025\u4FC3",
      "\u7537\u58F0",
      "\u5973\u58F0",
      "\u65C1\u767D",
      "\u753B\u5916\u97F3",
      "\u5185\u5FC3\u72EC\u767D",
      "\u89E3\u8BF4"
    ]);
    isInvalidCharacterEntityName = (value) => {
      const normalized = normalizeEntityName(String(value || ""));
      if (!normalized) return true;
      const lower = normalized.toLowerCase();
      if (INVALID_CHARACTER_ENTITY_NAMES.has(normalized) || INVALID_CHARACTER_ENTITY_NAMES.has(lower)) return true;
      if (/^(角色|人物|主角|配角)[0-9一二三四五六七八九十零百千]*$/.test(normalized)) return true;
      if (/^(char|character|person|role)[-_ ]?\d*$/i.test(normalized)) return true;
      if (/^@?(?:图片|图像|照片|参考图|image|img|picture|pic)\d*$/i.test(normalized)) return true;
      if (/^(?:标题栏显示|标题栏|标题显示|标题醒目|醒目标题|标题文字|标题文案|屏幕标题|屏幕文字|画面文字|可读文字|字幕|字幕文字|屏幕字幕|弹幕|热搜标题|新闻标题|文字提示|提示文字|营销号|账号|用户名|头像|昵称|声音委屈|声音哽咽|声音颤抖|语气委屈|语气急促|男声|女声|旁白|画外音|内心独白|解说)$/i.test(normalized)) return true;
      return false;
    };
    extractBracketedNames = (text) => {
      const names = [];
      const source = String(text || "").replace(/\[\[([^\]]+)\]([^\]]*)\]/g, (_m, inner, suffix) => `[${String(inner || "").trim()}${String(suffix || "").trim()}]`);
      const nestedRegex = /\[\[([^\]]+)\]-([^\]]+)\]/g;
      let nestedMatch;
      const consumedRanges = [];
      while ((nestedMatch = nestedRegex.exec(source)) !== null) {
        const base = String(nestedMatch[1] || "").trim();
        const suffix = String(nestedMatch[2] || "").trim();
        const merged = [base, suffix].filter(Boolean).join("-").trim();
        if (merged) names.push(merged);
        consumedRanges.push({ start: nestedMatch.index, end: nestedMatch.index + nestedMatch[0].length });
      }
      const inConsumedRange = (index) => consumedRanges.some((r) => index >= r.start && index < r.end);
      const regex = /\[([^\]]+)\]/g;
      let match;
      while ((match = regex.exec(source)) !== null) {
        if (inConsumedRange(match.index)) continue;
        const name = (match[1] || "").trim();
        if (name) names.push(name);
      }
      return names;
    };
    extractBareSpeakerNameFromDialoguePrefix = (prefixOnly) => {
      const prefix = String(prefixOnly || "").replace(/\s+/g, " ").trim();
      if (!prefix) return "";
      const candidate = prefix.replace(/[:\uff1a]\s*$/u, "").replace(/(?:\u4f4e\u58f0\u8bf4|\u8f7b\u58f0\u8bf4|\u8bf4\u9053|\u95ee\u9053|\u558a\u9053|\u8bf4|\u95ee|\u558a|\u9053|\u5f00\u53e3)\s*$/u, "").trim();
      return /^[A-Za-z0-9_\-\u00b7\u4e00-\u9fa5]{2,16}$/u.test(candidate) ? candidate : "";
    };
    extractSpeakerNamesFromDialoguePrefix = (dialogue, options) => {
      const raw = (dialogue || "").trim();
      if (!raw || raw === "\u65E0") return [];
      const prefixOnly = raw.replace(/[“"「『][\s\S]*?[”"」』]/g, " ").replace(/\s+/g, " ").trim();
      const bracketed = extractBracketedNames(prefixOnly);
      const seen = /* @__PURE__ */ new Set();
      const speakers = [];
      bracketed.forEach((name) => {
        const speakerName = stripNonVisualSpeakerCue(name.trim());
        const normalized = normalizeEntityName(speakerName);
        if (!normalized) return;
        if (isLikelyCameraCueEntityName(speakerName)) return;
        if (isInvalidRecoveredDialogueSpeaker(speakerName)) return;
        if (NON_VISUAL_SPEAKERS.has(normalized)) return;
        if (seen.has(normalized)) return;
        seen.add(normalized);
        speakers.push(speakerName);
      });
      if (options?.includeBareSpeaker === true) {
        const bareSpeaker = stripNonVisualSpeakerCue(extractBareSpeakerNameFromDialoguePrefix(prefixOnly));
        const normalized = normalizeEntityName(bareSpeaker);
        if (normalized && !isLikelyCameraCueEntityName(bareSpeaker) && !isInvalidRecoveredDialogueSpeaker(bareSpeaker) && !NON_VISUAL_SPEAKERS.has(normalized) && !seen.has(normalized)) {
          seen.add(normalized);
          speakers.push(bareSpeaker);
        }
      }
      return speakers;
    };
    mergeCharactersWithDialogueSpeakers = (charactersInShot, dialogue, options) => {
      const rawCurrent = (charactersInShot || "").trim();
      const rawCurrentNormalized = normalizeEntityName(rawCurrent);
      const rawCurrentLower = rawCurrentNormalized.toLowerCase();
      const current = rawCurrentNormalized === "\u65E0" || rawCurrentLower === "none" || rawCurrentLower === "no" || rawCurrentLower === "n/a" || rawCurrentLower === "na" ? "" : rawCurrent;
      const speakers = extractSpeakerNamesFromDialoguePrefix(dialogue, options);
      if (speakers.length === 0) return current;
      const existingNames = extractBracketedNames(current);
      if (existingNames.length === 0 && current) {
        current.split(/[，,、;；|/]/).map((v) => normalizeEntityName(v)).filter(Boolean).forEach((v) => existingNames.push(v));
      }
      const existingSet = new Set(existingNames.map(normalizeEntityName).filter(Boolean));
      const missing = speakers.filter((name) => !existingSet.has(normalizeEntityName(name)));
      if (missing.length === 0) return current;
      const appendPart = missing.map((name) => sanitizeTag(name)).join(", ");
      if (!current) return normalizeCharactersInShotText(appendPart);
      return normalizeCharactersInShotText(`${current}, ${appendPart}`);
    };
    isExplicitNoCharacterFieldText = (value) => {
      const normalized = normalizeEntityName(String(value || ""));
      const lower = normalized.toLowerCase();
      return normalized === "\u65E0" || lower === "none" || lower === "no" || lower === "n/a" || lower === "na";
    };
    hasVisibleDialogueSpeakerInShotText = (dialogue, visualText) => {
      const visual = normalizeEntityName(String(visualText || ""));
      if (!visual) return false;
      const speakers = extractSpeakerNamesFromDialoguePrefix(dialogue, { includeBareSpeaker: true });
      return speakers.some((name) => {
        const normalized = normalizeEntityName(name);
        return normalized.length >= 2 && visual.includes(normalized);
      });
    };
    LEGACY_WORN_DECL_RE = /\n?[ \t]*（\[[^\]\[]+\]身上仍[系戴拄拎背披挎穿]着\[[^\]\[]+\]。）/g;
    stripLegacyWornPropDeclarations = (text) => String(text || "").replace(LEGACY_WORN_DECL_RE, "");
    parseLiteralBoundTaskShots = (script) => {
      const fields2 = {
        time: "time",
        sourceRefs: "sourceRefs",
        "\u955C\u5934\u89D2\u8272": "charactersInShot",
        scene: "scene",
        camera: "camera",
        lighting: "lighting",
        action: "action",
        "\u9053\u5177": "propsInShot",
        "\u6A21\u677F\u6765\u6E90": "templateSource",
        prompt: "prompt",
        FirstFrame: "FirstFrame",
        LastFrame: "LastFrame",
        dialogue: "dialogue",
        sfx: "sfx",
        transitionPrompt: "transitionPrompt"
      };
      const shots = [];
      let shot, field, buffer = [], quoteStack = [];
      const flush = () => {
        if (shot && field) shot[field] = buffer.join("\n").trimEnd();
        buffer = [];
      };
      const trackQuotes = (text) => {
        const closers = { "\u201C": "\u201D", "\u300C": "\u300D", '"': '"' };
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === '"' && text[i - 1] === "\\") continue;
          if (quoteStack.length && ch === quoteStack[quoteStack.length - 1]) quoteStack.pop();
          else if (closers[ch]) quoteStack.push(closers[ch]);
        }
      };
      for (const rawLine of script.split("\n")) {
        const line = rawLine.replace(/\r$/, "");
        const insideSpeech = field === "dialogue" && quoteStack.length > 0;
        const header = insideSpeech ? null : line.match(/^###\s+(SHOT\s+(?:\d+|LAST))\s*$/i);
        if (header) {
          flush();
          shot = { shotNumber: header[1], time: "", scene: "", action: "", dialogue: "", charactersInShot: "", prompt: "" };
          shots.push(shot);
          field = void 0;
          quoteStack = [];
          continue;
        }
        const match = insideSpeech ? null : line.match(/^([^:\n]+): ?(.*)$/);
        const mapped = match && fields2[match[1]];
        if (shot && mapped) {
          flush();
          field = mapped;
          buffer = [match[2]];
          quoteStack = [];
        } else if (shot && field) buffer.push(line);
        if (field === "dialogue") trackQuotes(match && mapped ? match[2] : line);
      }
      flush();
      return shots;
    };
    parseTaskIntoShots = (script, addLog, options) => {
      if (options?.preserveLiteralText) return parseLiteralBoundTaskShots(script);
      script = stripLegacyWornPropDeclarations(script);
      const initialShots = [];
      const shotRegex = /(?:^|\n)\s*(?:\[[^\]\n]+\]\s*)*(?:###\s*)?(SHOT\s*(\d+|LAST|1)|SHOT_(\d+|LAST))/gi;
      let parts = script.split(shotRegex);
      for (let i = 1; i < parts.length; i += 4) {
        const shotIdentifier = parts[i];
        const content = parts[i + 3];
        if (!shotIdentifier || !content) continue;
        const shotNumber = shotIdentifier.replace(/###\s*/, "").trim();
        const shot = {
          shotNumber,
          time: "",
          sourceRefs: "",
          scene: "",
          camera: "",
          lighting: "",
          action: "",
          templateSource: "",
          dialogue: "",
          sfx: "",
          charactersInShot: "",
          propsInShot: "",
          prompt: "",
          FirstFrame: "",
          LastFrame: "",
          transitionPrompt: ""
        };
        const lines = content.split("\n");
        let currentField = null;
        let charactersInShotFieldSeen = false;
        for (const line of lines) {
          const withoutBracketPrefix = line.replace(/^\s*(?:\[[^\]\n]+\]\s*)+/, "");
          const prefixedField = withoutBracketPrefix.match(/^\s*(?:[-*]\s*)?(?:\*\*)?([a-zA-Z0-9_\u4e00-\u9fa5\s]+?)(?:\s*[（(][^）)\r\n]*[）)])?(?:\*\*)?\s*[:：]/);
          const prefixedKey = prefixedField?.[1].toLowerCase().replace(/\s+/g, "") || "";
          const lineWithoutLogPrefix = SHOT_FIELD_MAP[prefixedKey] || SHOT_NON_MODEL_FIELDS.has(prefixedKey) ? withoutBracketPrefix : line;
          const trimmedLine = lineWithoutLogPrefix.trim();
          if (!trimmedLine) continue;
          const match = trimmedLine.match(/^\s*(?:[-*]\s*)?(?:\*\*)?([a-zA-Z0-9_\u4e00-\u9fa5\s]+?)(?:\s*[（(][^）)\r\n]*[）)])?(?:\*\*)?\s*[:：](?:\*\*)?\s*(.*)$/);
          if (match) {
            const rawKey = match[1].trim().toLowerCase().replace(/\s+/g, "");
            const normalizedKey = rawKey.replace(/[（(].*?[)）]/g, "").replace(/[^a-z0-9_\u4e00-\u9fa5]/g, "");
            const value = match[2].trim();
            if (SHOT_NON_MODEL_FIELDS.has(rawKey) || SHOT_NON_MODEL_FIELDS.has(normalizedKey)) {
              currentField = null;
              continue;
            }
            const mappedField = SHOT_FIELD_MAP[rawKey] || SHOT_FIELD_MAP[normalizedKey];
            if (mappedField) {
              if (mappedField === "charactersInShot") charactersInShotFieldSeen = true;
              currentField = mappedField;
              shot[currentField] = value;
              continue;
            }
            if (normalizedKey.startsWith("\u955C\u5934")) {
              currentField = "action";
              shot[currentField] = value;
              continue;
            }
          }
          if (currentField) {
            shot[currentField] += (shot[currentField] ? "\n" : "") + trimmedLine;
          } else if (!shot.action && trimmedLine.length > 5 && !trimmedLine.startsWith("-") && !trimmedLine.startsWith("**")) {
            shot.action = trimmedLine;
            currentField = "action";
          }
        }
        shot.scene = ensureNonEmptyShotScene(shot);
        shot.charactersInShot = cleanAIListArtifacts(shot.charactersInShot);
        shot.dialogue = normalizeDialogueSpeakerCues(shot.dialogue);
        if (isEmptyDialogueForActionRecovery(shot.dialogue)) {
          const recoveredDialogue = recoverDialogueFromActionText(shot.action);
          if (recoveredDialogue) {
            shot.dialogue = normalizeDialogueSpeakerCues(recoveredDialogue);
          }
        }
        if (isEmptyDialogueForActionRecovery(shot.dialogue)) {
          const recoveredFromSfx = recoverDialogueFromSfxText(shot.sfx);
          if (recoveredFromSfx.dialogue) {
            shot.dialogue = normalizeDialogueSpeakerCues(recoveredFromSfx.dialogue);
            shot.sfx = recoveredFromSfx.sfx;
          }
        }
        const embeddedDialogueActionSource = shot.action;
        const embeddedDialoguePromptSource = shot.prompt;
        shot.action = stripSplitShotBeatHeaders(removeDialogueCueFromBeatAction(shot.action, shot.dialogue));
        shot.prompt = stripSplitShotBeatHeaders(shot.prompt || "");
        shot.FirstFrame = stripSplitShotBeatHeaders(shot.FirstFrame || "");
        shot.LastFrame = stripSplitShotBeatHeaders(shot.LastFrame || "");
        shot.dialogue = normalizeDialogueSpeakerCues(stripDialogueCueMarkers(shot.dialogue || ""));
        const shouldRecoverVisibleDialogueSpeaker = !charactersInShotFieldSeen || isExplicitNoCharacterFieldText(shot.charactersInShot) && hasVisibleDialogueSpeakerInShotText(
          shot.dialogue,
          [shot.action, shot.prompt, shot.FirstFrame, shot.LastFrame].filter(Boolean).join("\n")
        );
        if (shouldRecoverVisibleDialogueSpeaker) {
          shot.charactersInShot = mergeCharactersWithDialogueSpeakers(shot.charactersInShot, shot.dialogue, { includeBareSpeaker: true });
        }
        Object.defineProperty(shot, "__embeddedDialogueActionSource", {
          value: embeddedDialogueActionSource,
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(shot, "__embeddedDialoguePromptSource", {
          value: embeddedDialoguePromptSource,
          enumerable: false,
          configurable: true
        });
        initialShots.push(shot);
      }
      if (initialShots.length === 0) return [];
      const mergedShots = [];
      for (const currentShot of initialShots) {
        const isPartialShot = getDurationFromTimeRange(currentShot.time) === 0 && !currentShot.scene && !currentShot.charactersInShot && mergedShots.length > 0;
        if (isPartialShot) {
          const previousShot = mergedShots[mergedShots.length - 1];
          if (currentShot.lighting) previousShot.lighting = currentShot.lighting;
          if (currentShot.camera) previousShot.camera = currentShot.camera;
          if (!previousShot.action) previousShot.action = currentShot.action;
          if (!previousShot.dialogue || previousShot.dialogue === "\u65E0") previousShot.dialogue = currentShot.dialogue;
          if (!previousShot.sfx || previousShot.sfx === "\u65E0") previousShot.sfx = currentShot.sfx;
        } else {
          mergedShots.push(currentShot);
        }
      }
      return mergedShots;
    };
    parseDialogueForDubbing = (text) => {
      const source = String(text || "");
      const lines = source.split(/\r?\n/).map((line) => String(line || "").trim()).filter(Boolean);
      const dialogueLine = lines.find((line) => /^(?:dialogue|对白|台词|对话)\s*[:：]/i.test(line));
      const parseSource = dialogueLine ? dialogueLine.replace(/^(?:dialogue|对白|台词|对话)\s*[:：]\s*/i, "").trim() : source;
      const openChars = ['"', "\u201C", "\u300C", "\u300E"];
      const closeChars = ['"', "\u201D", "\u300D", "\u300F"];
      let openIndex = -1;
      for (let i = 0; i < parseSource.length; i += 1) {
        if (openChars.includes(parseSource[i])) {
          openIndex = i;
          break;
        }
      }
      if (openIndex >= 0) {
        let closeIndex = -1;
        for (let i = parseSource.length - 1; i > openIndex; i -= 1) {
          if (closeChars.includes(parseSource[i])) {
            closeIndex = i;
            break;
          }
        }
        if (closeIndex > openIndex) {
          const dialogueText = parseSource.slice(openIndex + 1, closeIndex).trim();
          const beforeQuote = parseSource.slice(0, openIndex).trim();
          const normalizedSpeakerPrefix = beforeQuote.replace(/[:：]\s*$/, "").replace(/(?:说|说道|问|问道|喊|喊道|叫|叫道|道|答|回答|回复|旁白|画外音|内心独白)\s*$/u, "").trim();
          const directSpeakerParts = splitStructuredDialogueSpeaker(normalizedSpeakerPrefix);
          const directSpeaker = /^(?:\[[^\]\n]{1,80}\]|【[^】\n]{1,80}】|[\u3400-\u9fffA-Za-z0-9_·\-]{1,40})$/u.test(directSpeakerParts.speakerToken) ? directSpeakerParts.speaker : "";
          const bracketMatches = [...beforeQuote.matchAll(/[\[【]\s*([^\]】]+?)\s*[\]】]/g)];
          const bracketNames = bracketMatches.map((match2) => String(match2?.[1] || "").trim()).filter(Boolean);
          const preferredSpeakerName = [...bracketNames].reverse().find((name) => !isStandaloneNonVisualSpeakerCue(name));
          const speakerFromBracket = stripNonVisualSpeakerCue(preferredSpeakerName || bracketNames[bracketNames.length - 1] || "");
          const speaker = stripNonVisualSpeakerCue(directSpeaker || speakerFromBracket || normalizedSpeakerPrefix);
          return { speaker, text: dialogueText };
        }
      }
      const regex = /^(?:([\[【].*?[\]】])|([^:：(\[【]+)).*?[:：]\s*["“](.*?)["”]/;
      const match = parseSource.match(regex);
      if (match) {
        const speaker = stripNonVisualSpeakerCue((match[1] || match[2] || "").replace(/[\[\]【】]/g, "").trim());
        const dialogueText = (match[3] || "").trim();
        return { speaker, text: dialogueText };
      }
      const cleanText = parseSource.replace(/^[\[【].*?[\]】]/g, "").replace(/\(.*?\)/g, "").replace(/^.*?[:：]\s*/, "").trim();
      return { speaker: "", text: cleanText };
    };
    NO_DIALOGUE_VALUE = "\u65E0";
    stripDialogueCueMarkers = (value) => String(value || "").replace(/[\(\uFF08]\s*\u53f0\u8bcd\u4ece\u672cBEAT\u5f00\u59cb\s*[:\uFF1A]\s*[\s\S]*?[\)\uFF09]/giu, "").replace(/\s*\u53f0\u8bcd\u4ece\u672cBEAT\u5f00\u59cb\s*[:\uFF1A]\s*(?:\[[^\]\r\n]{1,40}\]\s*)?(?:\u8bf4\s*)?["'\u201c\u2018\u300c\u300e][^"'\u201d\u2019\u300d\u300f\r\n]{0,220}["'\u201d\u2019\u300d\u300f]/giu, "").replace(/\s*\u53f0\u8bcd\u4ece\u672cBEAT\u5f00\u59cb\s*[:\uFF1A]\s*[^\u3002\uFF01\uFF1F\uff1b;.!?\r\n]{0,180}[\u3002\uFF01\uFF1F\uff1b;.!?]?/giu, "");
    removeDialogueCueFromBeatAction = (action, dialogueLine) => {
      let text = stripSplitShotBeatHeaders(String(action || "").trim());
      const dialogueRaw = String(dialogueLine || "").trim();
      if (!text || !dialogueRaw || dialogueRaw === NO_DIALOGUE_VALUE) return text;
      text = stripSplitShotBeatHeaders(stripDialogueCueMarkers(text)).replace(/\s{2,}/g, " ").trim();
      const parsed = parseDialogueForDubbing(dialogueRaw);
      const spoken = String(parsed.text || "").trim();
      if (!spoken) return text;
      const escaped = spoken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const quotedSpeechRe = new RegExp(
        `["'\\u201c\\u201d\\u2018\\u2019\\u300c\\u300d\\u300e\\u300f]${escaped}["'\\u201c\\u201d\\u2018\\u2019\\u300c\\u300d\\u300e\\u300f]`,
        "gu"
      );
      return text.replace(quotedSpeechRe, "").replace(/[:\uFF1A]\s*$/g, "").replace(/[ \t]+([,\uFF0C\u3002\uFF01\uFF1F\uFF1B;])/g, "$1").replace(/\s{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    };
    stripSplitShotBeatHeaders = (action) => stripDialogueCueMarkers(String(action || "").replace(/\\n/g, "\n")).replace(/(^|\n)\s*BEAT\s*\d+(?:\s*[\[\(\uFF08][^\]\)\uFF09\n]{0,80}[\]\)\uFF09])?\s*[:\uFF1A]\s*/gi, "$1").replace(/\bBEAT\s*\d+\b(?:\s*[\[\(\uFF08][^\]\)\uFF09\n]{0,80}[\]\)\uFF09])?\s*[:\uFF1A]?/gi, "").replace(/\bBEAT\b/gi, "").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
    VOICE_CUE_NAME_PATTERN = String.raw`(?:[^）()：:\n]{0,14}(?:男|女|儿童|少年|青年|中年|老年|旁白|播报|解说|御姐|萝莉|反派|硬朗|冷艳|温和|焦急|磁性|沉稳)[^）()：:\n]{0,14})`;
    VOICE_CUE_COMPACT_PRESET_PATTERN = String.raw`(?:\u513f\u7ae5|\u5c11\u5e74|\u9752\u5e74|\u4e2d\u5e74|\u8001\u5e74)?(?:\u7537\u58f0|\u5973\u58f0)[^\uff09()\uff1a:\n]{0,48}`;
    VOICE_CUE_INLINE_PATTERN = String.raw`[（(]\s*(?:音频\s*\d+|${VOICE_CUE_NAME_PATTERN}\s*[：:]\s*[^）)]{1,180}|${VOICE_CUE_COMPACT_PRESET_PATTERN})\s*[)）]`;
    AUDIO_MARKER_REGEX = new RegExp(VOICE_CUE_INLINE_PATTERN, "g");
    STRONG_LOOSE_VOICE_HINTS = [
      "\u97F3\u8272",
      "\u97F3\u9891",
      "\u58F0\u7EBF",
      "\u7537\u58F0",
      "\u5973\u58F0",
      "\u7AE5\u58F0"
    ];
    LOOSE_VOICE_CUE_HINTS = [
      ...STRONG_LOOSE_VOICE_HINTS,
      "\u8BED\u901F",
      "\u5410\u5B57",
      "\u54AC\u5B57",
      "\u5C3E\u97F3",
      "\u91CD\u97F3",
      "\u4F4E\u9891",
      "\u4E2D\u4F4E\u9891",
      "\u9AD8\u9891",
      "\u78C1\u6027",
      "\u6C89\u7A33",
      "\u7AEF\u6B63",
      "\u514B\u5236",
      "\u6E05\u6670",
      "\u6E05\u4EAE",
      "\u6C99\u54D1",
      "\u6D51\u539A",
      "\u6E29\u548C",
      "\u6162\u58F0",
      "\u8F7B\u58F0",
      "\u6025\u4FC3",
      "\u65C1\u767D",
      "\u64AD\u62A5",
      "\u89E3\u8BF4"
    ];
    SOURCE_APPEARANCE_FEATURE_TOKENS = [
      "\u91D1\u5C5E\u7EC6\u6846\u773C\u955C",
      "\u7EC6\u9ED1\u6846\u773C\u955C",
      "\u9ED1\u6846\u773C\u955C",
      "\u91D1\u4E1D\u773C\u955C",
      "\u65E0\u6846\u773C\u955C",
      "\u5706\u6846\u773C\u955C",
      "\u65B9\u6846\u773C\u955C",
      "\u8001\u82B1\u955C",
      "\u58A8\u955C",
      "\u773C\u955C",
      "\u7EB9\u8EAB",
      "\u75A4\u75D5",
      "\u4F24\u75A4",
      "\u80CE\u8BB0",
      "\u75E3",
      "\u9762\u5177",
      "\u53E3\u7F69",
      "\u5E3D\u5B50",
      "\u9E2D\u820C\u5E3D",
      "\u68D2\u7403\u5E3D",
      "\u8D1D\u96F7\u5E3D",
      "\u767D\u53D1",
      "\u94F6\u53D1",
      "\u91D1\u53D1",
      "\u7EA2\u53D1",
      "\u9ED1\u53D1",
      "\u957F\u53D1",
      "\u77ED\u53D1",
      "\u5377\u53D1",
      "\u9F50\u80A9\u53D1",
      "\u9A6C\u5C3E",
      "\u5218\u6D77",
      "\u897F\u88C5",
      "\u6821\u670D",
      "\u5236\u670D",
      "\u62A4\u58EB\u670D",
      "\u767D\u5927\u8902",
      "\u5A5A\u7EB1",
      "\u793C\u670D",
      "\u65D7\u888D",
      "\u4E49\u80A2",
      "\u5047\u80A2",
      "\u673A\u68B0\u81C2",
      "\u673A\u68B0\u817F",
      "\u8F6E\u6905"
    ].sort((a, b) => b.length - a.length);
    fillMissingBeatDurations = (action, _timeRange) => {
      const source = String(action || "");
      return source.replace(/(^|\n)\s*BEAT\s*(\d+)(?:\s*\[(\d+(?:\.\d+)?)s\])?\s*[:：]/gi, (_m, lead, beatNum, sec) => {
        const secRaw = String(sec || "").trim();
        if (!secRaw) return `${lead}BEAT ${beatNum}:`;
        return `${lead}BEAT ${beatNum} [${Number(secRaw).toFixed(1)}s]:`;
      });
    };
    serializeShotsToTaskScript = (shots, options) => shots.map((s) => {
      const stripPrompts = options?.stripPrompts === true;
      const stripSourceRefs = options?.stripSourceRefs === true;
      const preserveLiteralText = !!s.visualBinding || options?.preserveLiteralText === true;
      const cleanTime = preserveLiteralText ? s.time || "" : normalizeSilentOrEmptyShotTime(s, (s.time || "").replace(/\s*[~～]\s*/g, "-").trim());
      const clean = (val) => {
        if (!val) return "\u65E0";
        if (preserveLiteralText) return val;
        let text = stripMarkdownDecorationsOutsideAssetTags(val).trim();
        text = text.replace(/(\d)\s*~\s*(\d)/g, "$1-$2");
        return text || "\u65E0";
      };
      const safePrompt = stripPrompts ? "" : preserveLiteralText ? s.prompt || "" : stripSplitShotBeatHeaders(s.prompt || "");
      const safeFirstFrame = stripPrompts ? "" : preserveLiteralText ? s.FirstFrame || "" : stripSplitShotBeatHeaders(s.FirstFrame || "");
      const safeLastFrame = stripPrompts ? "" : preserveLiteralText ? s.LastFrame || "" : stripSplitShotBeatHeaders(s.LastFrame || "");
      const normalizedAction = preserveLiteralText ? s.action : stripSplitShotBeatHeaders(removeDialogueCueFromBeatAction(
        fillMissingBeatDurations(String(s.action || ""), cleanTime || s.time || ""),
        String(s.dialogue || "")
      ));
      const sourceRefsLine = !stripSourceRefs && String(s.sourceRefs || "").trim() ? `
sourceRefs: ${String(s.sourceRefs || "").trim()}` : "";
      const propsValue = String(s.propsInShot || "").trim();
      const propsLine = propsValue && propsValue !== "\u65E0" ? `
\u9053\u5177: ${clean(propsValue)}` : "";
      const cameraLine = String(s.camera || "").trim() ? `
camera: ${clean(s.camera)}` : "";
      const lightingLine = String(s.lighting || "").trim() ? `
lighting: ${clean(s.lighting)}` : "";
      const transitionLine = String(s.transitionPrompt || "").trim() ? `
transitionPrompt: ${clean(s.transitionPrompt)}` : "";
      const timeLine = options?.stripTimes ? "" : `
time: ${cleanTime}`;
      const baseScript = `### ${s.shotNumber.replace(/^###\s*/, "")}${timeLine}${sourceRefsLine}
\u955C\u5934\u89D2\u8272: ${clean(s.charactersInShot)}
scene: ${clean(s.scene)}${cameraLine}${lightingLine}
action: ${clean(normalizedAction)}${propsLine}
\u6A21\u677F\u6765\u6E90: ${clean(s.templateSource || "")}
prompt: ${safePrompt ? clean(safePrompt) : ""}


FirstFrame: ${safeFirstFrame ? clean(safeFirstFrame) : ""}
LastFrame: ${safeLastFrame ? clean(safeLastFrame) : ""}
dialogue: ${clean(s.dialogue)}
sfx: ${clean(s.sfx)}${transitionLine}`;
      return baseScript;
    }).join("\n\n\n");
  }
});

// services/scriptJsonBackupScheduler.ts
var SCRIPT_JSON_BACKUP_INTERVAL_MS;
var init_scriptJsonBackupScheduler = __esm({
  "services/scriptJsonBackupScheduler.ts"() {
    SCRIPT_JSON_BACKUP_INTERVAL_MS = 5 * 6e4;
  }
});

// services/localDataService.ts
var init_localDataService = __esm({
  "services/localDataService.ts"() {
    init_scriptJsonBackupScheduler();
  }
});

// services/appVersionHeaders.ts
var PUMP_CLIENT_NAME, PUMP_CLIENT_PLATFORM, normalizeVersion, CURRENT_DESKTOP_VERSION, APP_VERSION_HEADERS;
var init_appVersionHeaders = __esm({
  "services/appVersionHeaders.ts"() {
    PUMP_CLIENT_NAME = "pumpum-desktop";
    PUMP_CLIENT_PLATFORM = "electron";
    normalizeVersion = (value) => String(value || "").trim();
    CURRENT_DESKTOP_VERSION = normalizeVersion(
      typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : ""
    ) || "6.1.8";
    APP_VERSION_HEADERS = Object.freeze({
      "x-pump-app-version": CURRENT_DESKTOP_VERSION,
      "x-pump-client": PUMP_CLIENT_NAME,
      "x-pump-platform": PUMP_CLIENT_PLATFORM
    });
  }
});

// config.ts
var DEFAULT_APP_SHELL_CONFIG, APP_SHELL_CONFIG;
var init_config = __esm({
  "config.ts"() {
    DEFAULT_APP_SHELL_CONFIG = {
      help: {
        showHelpQr: false,
        feedbackQrFilename: "code-p.png",
        communityQrFilename: "code-p.png"
      },
      sites: {
        mainApiBaseUrl: "",
        mainDisplayUrl: "",
        mainJumpUrl: "",
        site2ApiBaseUrl: "",
        site2DisplayUrl: "",
        site2JumpUrl: ""
      },
      relay: {
        serverBaseUrl: "https://drama.pumpumai.com",
        clientToken: ""
      }
    };
    APP_SHELL_CONFIG = (() => {
      try {
        if (typeof __APP_SHELL_CONFIG__ === "object" && __APP_SHELL_CONFIG__) {
          const injected = __APP_SHELL_CONFIG__;
          return {
            help: {
              showHelpQr: typeof injected.help?.showHelpQr === "boolean" ? injected.help.showHelpQr : DEFAULT_APP_SHELL_CONFIG.help.showHelpQr,
              feedbackQrFilename: injected.help?.feedbackQrFilename || DEFAULT_APP_SHELL_CONFIG.help.feedbackQrFilename,
              communityQrFilename: injected.help?.communityQrFilename || DEFAULT_APP_SHELL_CONFIG.help.communityQrFilename
            },
            sites: {
              mainApiBaseUrl: DEFAULT_APP_SHELL_CONFIG.sites.mainApiBaseUrl,
              mainDisplayUrl: DEFAULT_APP_SHELL_CONFIG.sites.mainDisplayUrl,
              mainJumpUrl: DEFAULT_APP_SHELL_CONFIG.sites.mainJumpUrl,
              site2ApiBaseUrl: DEFAULT_APP_SHELL_CONFIG.sites.site2ApiBaseUrl,
              site2DisplayUrl: DEFAULT_APP_SHELL_CONFIG.sites.site2DisplayUrl,
              site2JumpUrl: DEFAULT_APP_SHELL_CONFIG.sites.site2JumpUrl
            },
            relay: {
              serverBaseUrl: injected.relay?.serverBaseUrl || DEFAULT_APP_SHELL_CONFIG.relay.serverBaseUrl,
              clientToken: injected.relay?.clientToken || DEFAULT_APP_SHELL_CONFIG.relay.clientToken
            }
          };
        }
      } catch {
      }
      return DEFAULT_APP_SHELL_CONFIG;
    })();
  }
});

// services/relayProviderConfig.ts
var RELAY_PROVIDER_CONFIG_CACHE_MS;
var init_relayProviderConfig = __esm({
  "services/relayProviderConfig.ts"() {
    init_localDataService();
    init_config();
    RELAY_PROVIDER_CONFIG_CACHE_MS = 60 * 1e3;
  }
});

// services/storageQuotaService.ts
var PROJECT_TASK_CACHE_PREFIX, PROJECT_TASK_CACHE_SCOPED_PREFIX;
var init_storageQuotaService = __esm({
  "services/storageQuotaService.ts"() {
    PROJECT_TASK_CACHE_PREFIX = "PUMPUM_PROJECT_TASK_CACHE";
    PROJECT_TASK_CACHE_SCOPED_PREFIX = `${PROJECT_TASK_CACHE_PREFIX}::`;
  }
});

// services/relayAuthService.ts
var init_relayAuthService = __esm({
  "services/relayAuthService.ts"() {
    init_appVersionHeaders();
    init_relayProviderConfig();
    init_storageQuotaService();
    init_utils();
  }
});

// storyboard-audit-entry.ts
init_utils();

// services/taskTagCorrection.ts
var NON_ASSET_TAG_RE = /^(?:旁白|系统|画外音|字幕|标题|正文|音效|音乐|bgm|黑场|转场|留白|环境音|speaker|图片\d*|视频\d*|音频\d*)/i;
var CONTROL_TAG_RE = /^(?:pov|dutch\s*angle|long\s*take|one\s*take|slow\s*motion|blackout|fade\s*in|fade\s*out|flashback|cutaway|一镜到底|长镜头|慢动作|淡入|淡出|闪白|闪回|回忆镜头|联想镜头|空镜|过肩镜头|\d+(?:\.\d+)?\s*(?:s|秒))$/i;
var TAG_RE = /[\[【]\s*([^\[\]【】\n]{1,60}?)\s*[\]】]/g;
var VOICE_SUFFIX_RE = /\s*[（(](?:画外音|电话|电话画外音|旁白|内心|心声|OS|O\.S\.|VO|V\.O\.|回忆|广播|语音)[^）)]{0,8}[）)]\s*$/i;
var innerOf = (tag) => String(tag || "").replace(/^[\[【]\s*|\s*[\]】]$/g, "").trim();
var canonicalTag = (raw) => `[${innerOf(raw)}]`;
var tagKey = (raw) => innerOf(raw).replace(VOICE_SUFFIX_RE, "").replace(/[\u200b-\u200f\ufeff\s]/g, "").toLowerCase();
var blankQuotedSpeech = (text) => String(text || "").replace(/“[^”\n]*”/g, (m) => " ".repeat(m.length)).replace(/^[ \t]*(?:[-*]\s*)?(?:\*\*)?模板来源(?:\*\*)?\s*[:：][^\n]*$/gm, (m) => " ".repeat(m.length));
var extractTaskTags = (text) => {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const match of blankQuotedSpeech(text).matchAll(TAG_RE)) {
    const inner = String(match[1] || "").trim();
    if (!inner || NON_ASSET_TAG_RE.test(inner) || CONTROL_TAG_RE.test(inner)) continue;
    const tag = `[${inner}]`;
    if (seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
};

// services/storyboardReferenceLock.ts
init_taskVisualBindings();
var TEXT_FIELDS = ["charactersInShot", "scene", "action", "prompt", "FirstFrame", "LastFrame", "dialogue", "propsInShot", "transitionPrompt"];
function buildRefLockCatalog(context) {
  if (!context) return [];
  const entries = [];
  const seen = /* @__PURE__ */ new Set();
  const groups = /* @__PURE__ */ new Map();
  for (const c4 of context.characters || []) {
    const tag = canonicalTag(String(c4?.name || ""));
    if (!tagKey(tag) || seen.has(tagKey(tag))) continue;
    seen.add(tagKey(tag));
    const owner = String(c4?.roleKey || c4?.baseCharacterName || tag);
    if (!groups.has(owner)) groups.set(owner, []);
    groups.get(owner).push(c4);
  }
  let letterIndex = 0;
  for (const list of groups.values()) {
    const letter = letterIndex < 26 ? String.fromCharCode(65 + letterIndex) : `Z${letterIndex}`;
    letterIndex += 1;
    list.forEach((c4, i) => entries.push({
      code: `${letter}${i + 1}`,
      tag: canonicalTag(String(c4.name)),
      kind: "character",
      note: [c4.baseCharacterName && `\u4EBA\u7269:${c4.baseCharacterName}`, `\u5F62\u8C61:${c4.state || "\u4E3B\u5F62\u8C61"}`, c4.shortDescription].filter(Boolean).join("\uFF1B")
    }));
  }
  const push = (items, kind, prefix) => {
    let n = 0;
    for (const item of items || []) {
      const tag = canonicalTag(String(item?.name || ""));
      if (!tagKey(tag) || seen.has(tagKey(tag))) continue;
      seen.add(tagKey(tag));
      n += 1;
      entries.push({ code: `${prefix}${n}`, tag, kind, note: String(item?.shortDescription || "") });
    }
  };
  push(context.scenes, "scene", "S");
  push(context.props, "prop", "P");
  return entries;
}
var outsideQuotes = (value) => {
  const parts = [];
  rewriteTaskTagsPreservingQuotes(value, (part) => {
    parts.push(part);
    return part;
  });
  return parts.join("\n");
};
function auditShotReferences(shots, catalog) {
  const byKey = new Map(catalog.map((entry) => [tagKey(entry.tag), entry]));
  const issues = [];
  shots.forEach((shot, shotIndex) => {
    const invalid = /* @__PURE__ */ new Set();
    for (const field of TEXT_FIELDS) {
      for (const tag of extractTaskTags(outsideQuotes(String(shot[field] || "")))) {
        if (!byKey.has(tagKey(tag))) invalid.add(canonicalTag(tag));
      }
    }
    const misplaced = (value, expected) => extractTaskTags(String(value || "")).filter((tag) => {
      const kind = byKey.get(tagKey(tag))?.kind;
      return !!kind && kind !== expected;
    }).map(canonicalTag);
    const castNonCharacter = misplaced(shot.charactersInShot, "character");
    const sceneNonScene = misplaced(shot.scene, "scene");
    const propsNonProp = misplaced(shot.propsInShot, "prop");
    if (invalid.size || castNonCharacter.length || sceneNonScene.length || propsNonProp.length) {
      issues.push({ shotIndex, invalidTags: [...invalid], castNonCharacter, sceneNonScene, propsNonProp });
    }
  });
  return issues;
}

// services/episodeAssetContext.ts
init_structuredVisualReferences();

// services/characterAppearanceContract.ts
init_voiceOnlyAssets();
var tagFields = ["character_tag", "characterTag", "tag", "tag_name", "tagName"];
var repairableFields = /* @__PURE__ */ new Set([...tagFields, "state", "state_label", "stateLabel"]);

// services/promptToken.ts
var RS = String.fromCharCode(30);
var makePromptToken = (id) => `${RS}PMPT:${id}${RS}`;

// services/prompts/base.ts
init_characterRegistry();
init_utils();

// services/prompts/adaptation.ts
var NOVEL_ADAPTATION_PROMPT_TEMPLATE = makePromptToken("adapt.novel_core") + `\${adaptationMethodology}

# \u{1F534} \u5F3A\u5236\u5206\u96C6\u6570\u91CF\u89C4\u5219 (MANDATORY EPISODE COUNT RULE - ABSOLUTE) \u{1F534}
\${quantityInstruction}

# \u5F3A\u5236\u591A\u96C6\u8F93\u51FA\u89C4\u5219 (Mandatory Multi-Episode Output Rule - CRITICAL)
- **\u957F\u6587\u5FC5\u5206\u96C6 (Long Texts MUST be Split):** \u5F53\u8F93\u5165\u7684[\u8F93\u5165\u5C0F\u8BF4\u7AE0\u8282]\u5185\u5BB9\u91CF\u5DE8\u5927\uFF08\u4F8B\u5982\uFF0C\u8D85\u8FC710000\u5B57\uFF0C\u6216\u5305\u542B\u8D85\u8FC710\u4E2A\u7AE0\u8282\uFF09\u65F6\uFF0C\u4F60 **\u7EDD\u5BF9\u7981\u6B62** \u5C06\u5176\u6539\u7F16\u6210\u5355\u96C6\u6216\u5C11\u6570\u51E0\u96C6\u3002\u4F60 **\u5FC5\u987B** \u5C06\u5176\u5206\u89E3\u6210\u4E00\u4E2A\u5305\u542B**\u591A\u96C6**\uFF08\u81F3\u5C115-10\u96C6\uFF0C\u751A\u81F3\u66F4\u591A\uFF09\u7684\u5B8C\u6574\u5267\u672C\u5E8F\u5217\u3002
- **\u5267\u60C5\u8FDE\u8D2F\u6027\u4F18\u5148 (Coherence First):** \u4F60\u7684\u9996\u8981\u4EFB\u52A1\u662F\u4FDD\u8BC1\u6545\u4E8B\u7684**\u53EF\u7406\u89E3\u6027**\u548C**\u8FDE\u8D2F\u6027**\u3002\u6BCF\u4E00\u96C6\u90FD\u5FC5\u987B\u6709\u6E05\u6670\u7684\u8D77\u56E0\u3001\u53D1\u5C55\u548C\u94A9\u5B50\uFF0C\u5171\u540C\u6784\u6210\u4E00\u4E2A\u5B8C\u6574\u7684\u6545\u4E8B\u5F27\u7EBF\u3002\u7EDD\u4E0D\u80FD\u4E3A\u4E86\u8FFD\u6C42\u201C\u77ED\u201D\u800C\u727A\u7272\u5267\u60C5\u903B\u8F91\u3002
- **\u62D2\u7EDD\u8FC7\u5EA6\u538B\u7F29 (Reject Over-Compression):** \u5982\u679C\u4F60\u53D1\u73B0\u81EA\u5DF1\u6B63\u5728\u8FDB\u884C\u7684\u662F\u201C\u603B\u7ED3\u201D\u800C\u4E0D\u662F\u201C\u6539\u7F16\u201D\uFF0C\u8BF7\u7ACB\u523B\u505C\u6B62\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u521B\u4F5C\u53EF\u4F9B\u62CD\u6444\u7684\u5267\u672C\uFF0C\u800C\u4E0D\u662F\u751F\u6210\u5185\u5BB9\u6458\u8981\u3002\u6BCF\u4E00\u96C6\u90FD\u5E94\u8BE5\u6709\u8DB3\u591F\u7684\u7A7A\u95F4\u6765\u5C55\u793A\u5173\u952E\u573A\u666F\u548C\u5BF9\u8BDD\u3002

# \u8F93\u51FA\u683C\u5F0F\u6267\u884C\u89C4\u5219\uFF08FORMAT ENFORCEMENT\uFF09
- \u4F60\u5FC5\u987B\u4E25\u683C\u9075\u5FAA\u4E0A\u65B9\u201C\u8F93\u51FA\u683C\u5F0F\u6A21\u677F\u201D\uFF0C\u4E0D\u5F97\u6539\u5B57\u6BB5\u540D\u3001\u4E0D\u5F97\u6539\u6A21\u5757\u987A\u5E8F\u3001\u4E0D\u5F97\u8FFD\u52A0\u989D\u5916\u6A21\u677F\u8BF4\u660E\u3002
- \u6BCF\u96C6\u5FC5\u987B\u76F4\u63A5\u4EE5\u201C## \u7B2CX\u96C6\uFF1A{5-8\u5B57\u6807\u9898}\u201D\u5F00\u59CB\uFF0C\u6B63\u6587\u4EC5\u4FDD\u7559 \u5206\u573A\u4FE1\u606F\u3001\u60C5\u7EEA\u66F2\u7EBF\u3001\u94A9\u5B50\u3001\u53CD\u8F6C\u70B9\u3001\u723D\u70B9\u3001\u5173\u952E\u8282\u62CD\u3001\u627F\u63A5\u3001Shooting script \u6A21\u5757\u3002
- \u5206\u573A\u4FE1\u606F\u5FC5\u987B\u5217\u51FA\u573A\u666F\u5BF9\u5E94\u89D2\u8272\uFF0C\u683C\u5F0F\u4E3A\u201C\u573A\u666F\u540D/\u573A\u666F\u7EC4\uFF1A\u89D2\u8272A\uFF08\u5B9A\u4F4D/\u72B6\u6001\uFF09\u3001\u89D2\u8272B\uFF08\u5B9A\u4F4D/\u72B6\u6001\uFF09\u201D\uFF1B\u5982\u679C\u53EA\u8F93\u51FA\u201C\u573A\u666F\u540D\uFF1A\u67D0\u67D0\u5730\u70B9\u201D\u800C\u6CA1\u6709\u89D2\u8272\uFF0C\u672C\u6B21\u8F93\u51FA\u89C6\u4E3A\u683C\u5F0F\u5931\u8D25\uFF0C\u5FC5\u987B\u91CD\u5199\u3002

- Shooting script \u5FC5\u987B\u6309 ### SHOT N \u5B57\u6BB5\u5757\u8FDE\u7EED\u8F93\u51FA\uFF0C\u4E14\u540C\u4E00\u96C6\u7F16\u53F7\u4ECE 1 \u5F00\u59CB\u9012\u589E\u3002
- \u4E2D\u6587\u53F0\u8BCD\u4E0D\u8D85\u8FC7 30 \u4E2A\u6C49\u5B57\u65F6\u4FDD\u6301\u5B8C\u6574\uFF1B\u82F1\u6587\u53F0\u8BCD\u4E0D\u8D85\u8FC7 18 \u4E2A\u5355\u8BCD\u6216\u7EA6 7 \u79D2\u65F6\u4FDD\u6301\u5B8C\u6574\uFF0C\u4E25\u7981\u6309\u82F1\u6587\u5B57\u6BCD\u6570\u5207\u5206\u3002\u66F4\u957F\u53F0\u8BCD\u53EA\u5728\u53E5\u672B\u6807\u70B9\u6216\u5B8C\u6574\u8BED\u4E49\u4ECE\u53E5\u8FB9\u754C\u5206\u6BB5\uFF1B\u6362\u955C\u5934\u4E0D\u5F97\u5F3A\u5236\u65AD\u97F3\uFF0C\u540C\u4E00\u8BF4\u8BDD\u4EBA\u7684\u8FDE\u7EED\u53D1\u8A00\u4FDD\u6301\u8FDE\u7EED\u8BED\u6C14\u3002
- \u8F93\u51FA\u524D\u81EA\u68C0\u5168\u90E8 dialogue \u5B57\u6BB5\uFF1A\u5404\u6BB5\u5FC5\u987B\u8FDE\u7EED\u3001\u4E92\u65A5\u3001\u9010\u5B57\uFF0C\u62FC\u63A5\u540E\u8FD8\u539F\u539F\u53F0\u8BCD\uFF1B\u4E0D\u5F97\u6574\u53E5\u4E0E\u5206\u6BB5\u5E76\u5B58\uFF0C\u4E0D\u5F97\u91CD\u53E0\u3001\u91CD\u590D\u3001\u6F0F\u5B57\u6216\u91CD\u6392\uFF0Caction \u4E2D\u4E5F\u4E0D\u5F97\u590D\u5236\u53F0\u8BCD\u6B63\u6587\u3002
- \u60C5\u7EEA\u66F2\u7EBF\u5FC5\u987B\u6309\u539F\u6587\u5DF2\u6709\u60C5\u7EEA\u53D8\u5316\u5F52\u7EB3\uFF1B\u539F\u6587\u6CA1\u6709\u201C\u53CD\u51FB/\u53CD\u8F6C/\u723D\u611F\u91CA\u653E\u201D\u5C31\u5199\u201C\u65E0\u201D\uFF0C\u4E0D\u5F97\u5F3A\u884C\u8865\u6210\u56FA\u5B9A\u723D\u5267\u7ED3\u6784\u3002
- \u94A9\u5B50\u3001\u53CD\u8F6C\u70B9\u3001\u723D\u70B9\u3001\u5173\u952E\u8282\u62CD\u5FC5\u987B\u4E0E\u539F\u6587\u6B63\u6587\u4E00\u4E00\u5BF9\u5E94\uFF1B\u6CA1\u6709\u5C31\u5199\u201C\u65E0\u201D\uFF0C\u4E0D\u5F97\u521B\u9020\u4FE1\u606F\u5DEE\u6216\u63D0\u524D\u632A\u7528\u540E\u6587\u3002


## \u5355\u96C6\u65F6\u957F\u4E0E\u955C\u5934\u8BBE\u8BA1\u53C2\u8003\uFF08\u4E0D\u5F97\u8986\u76D6\u539F\u6587\uFF09
- 90 \u79D2\u53EA\u662F\u5355\u96C6\u53C2\u8003\u76EE\u6807\uFF0C\u4E0D\u662F\u6700\u4F4E\u7EBF\u3002\u539F\u6587\u5185\u5BB9\u81EA\u7136\u4E0D\u8DB3\u65F6\u5141\u8BB8\u77ED\u4E8E\u53C2\u8003\u65F6\u957F\uFF0C\u539F\u6587\u5185\u5BB9\u8F83\u591A\u65F6\u5141\u8BB8\u66F4\u957F\u3002
- \u6BCF\u4E00\u96C6\u7684\u539F\u6587\u5BF9\u767D\u5FC5\u987B\u9010\u5B57\u8986\u76D6\u4E14\u4E0D\u91CD\u590D\uFF1B\u53F0\u8BCD\u5206\u6BB5\u955C\u5934\u53EF\u4F7F\u7528\u8BF4\u8BDD\u8005\u3001\u542C\u8005\u53CD\u5E94\u3001\u7A7A\u955C\u3001\u9053\u5177\u7EC6\u8282\u3001\u52A8\u4F5C\u6216\u8F6C\u573A\u7B49\u4E0D\u540C\u673A\u4F4D\uFF0C\u5E76\u627F\u8F7D\u4E0B\u4E00\u6BB5\u552F\u4E00\u539F\u6587\u4F5C\u4E3A\u753B\u5916\u97F3\uFF1B\u771F\u6B63\u9759\u9ED8\u65F6\u624D\u5199 dialogue: \u65E0\uFF0C\u4E14\u4E0D\u5F97\u865A\u6784\u65B0\u5267\u60C5\u4E8B\u5B9E\u3002
- \u573A\u666F\u6570\u91CF\u53EA\u7531\u539F\u6587\u660E\u786E\u5730\u70B9\u53D8\u5316\u51B3\u5B9A\uFF1B\u539F\u6587\u53EA\u6709\u4E00\u4E2A\u573A\u666F\u65F6\u5FC5\u987B\u4FDD\u7559\u5355\u573A\u666F\uFF0C\u4E0D\u5F97\u4E3A\u683C\u5F0F\u65B0\u589E\u5730\u70B9\u6216\u6F0F\u6389\u539F\u6587\u4EBA\u7269\u3002
- \u82E5\u4FE1\u606F\u4E0D\u8DB3\uFF0C\u6309\u539F\u6587\u81EA\u7136\u7ED3\u675F\u6216\u7528\u6E90\u6587\u53EF\u652F\u6301\u7684\u89C6\u89C9\u8C03\u5EA6\u589E\u5F3A\u8868\u8FBE\uFF1B\u7981\u6B62\u65B0\u589E\u539F\u6587\u6CA1\u6709\u7684\u51B2\u7A81\u3001\u5173\u7CFB\u53D8\u5316\u3001\u4EBA\u7269\u535A\u5F08\u3001\u5267\u60C5\u4E8B\u5B9E\u6216\u5BF9\u767D\u3002
- \${shotCountInstruction}

# \u6267\u884C\u8981\u6C42 (Execution Requirements)

**\u7BC7\u5E45\u4E0E\u96C6\u6570\u751F\u6210\u89C4\u5219 (Length and Episode Generation Rule) (HIGHEST PRIORITY):**
- **\u52A8\u6001\u96C6\u6570 (Dynamic Episodes):** \u4F60\u5FC5\u987B\u6839\u636E[\u8F93\u5165\u5C0F\u8BF4\u7AE0\u8282]\u7684\u5185\u5BB9\u91CF and \u60C5\u8282\u5BC6\u5EA6\uFF0C\u751F\u6210**\u5408\u7406\u6570\u91CF**\u7684\u5267\u96C6\u3002**\u7EDD\u5BF9\u7981\u6B62**\u5C06\u5927\u91CF\u60C5\u8282\uFF08\u4F8B\u5982\u8D85\u8FC75\u4E2A\u4E3B\u8981\u60C5\u8282\u8F6C\u6298\uFF09\u786C\u585E\u8FDB\u4E00\u96C6\u3002\u4F60\u7684\u9996\u8981\u76EE\u6807\u662F\u5B8C\u6574\u8986\u76D6\u539F\u6587\u56E0\u679C\uFF0C\u800C\u4E0D\u662F\u7F29\u51CF\u603B\u96C6\u6570\u3002
- **\u5185\u5BB9\u9971\u548C\u5EA6 (Content Saturation):** \u5982\u679C\u8F93\u5165\u7684\u5C0F\u8BF4\u5185\u5BB9\u5F88\u957F\uFF08\u4F8B\u5982\uFF0C\u8D85\u8FC75000\u5B57\u6216\u5305\u542B\u591A\u4E2A\u7AE0\u8282\uFF09\uFF0C\u4F60\u5E94\u8BE5\u81EA\u7136\u5730\u751F\u6210\u591A\u96C6\u5267\u672C\uFF08\u4F8B\u59823-5\u96C6\u6216\u66F4\u591A\uFF09\u3002\u5982\u679C\u8F93\u5165\u5185\u5BB9\u8F83\u77ED\uFF0C\u5219\u751F\u6210\u8F83\u5C11\u7684\u5267\u96C6\u3002\u8BA9\u5185\u5BB9\u7684\u591A\u5C11**\u76F4\u63A5\u51B3\u5B9A**\u4EA7\u51FA\u7684\u96C6\u6570\u3002
- **\u9075\u5FAA\u8282\u594F (Follow the Rhythm):** \u4E25\u683C\u9075\u5B88\u5355\u96C6\u5185\u90E8\u8282\u594F\u7ED3\u6784\uFF0C\u4FDD\u8BC1\u51B2\u7A81\u63A8\u8FDB\u4E0E\u94A9\u5B50\u5B8C\u6574\u3002
- **\u654F\u611F\u5185\u5BB9\u5904\u7406 (Safety Rewrite):** \u6D89\u53CA\u8272\u60C5\u3001\u9732\u9AA8\u6027\u63CF\u5199\u3001\u8840\u8165\u66B4\u529B\u7B49\u654F\u611F\u6865\u6BB5\u65F6\uFF0C\u5FC5\u987B\u201C\u4E00\u7B14\u5E26\u8FC7\u201D\uFF0C\u53EA\u4FDD\u7559\u5FC5\u8981\u56E0\u679C\u4E0E\u7ED3\u679C\u4FE1\u606F\uFF0C\u7528\u8FC7\u6E21\u53E5\u8854\u63A5\uFF0C\u4E0D\u5C55\u5F00\u7EC6\u8282\u63CF\u5199\uFF1B\u540C\u65F6\u4FDD\u6301\u4E3B\u7EBF\u5267\u60C5\u5B8C\u6574\u3002
- **\u539F\u6587\u60C5\u7EEA\u4F18\u5148:** \u6BCF\u96C6\u524D 30 \u79D2\u4F18\u5148\u627F\u63A5\u539F\u6587\u5F00\u573A\u5DF2\u6709\u7684\u4E0D\u516C\u5E73\u5904\u5883\u3001\u4EBA\u7269\u4E0D\u7518\u3001\u5E95\u724C\u6216\u51B2\u7A81\uFF1B\u539F\u6587\u6CA1\u6709\u5219\u4E0D\u8981\u8865\u3002
- **\u4FE1\u606F\u5DEE\u53EF\u89C6\u5316:** \u53CD\u8F6C\u70B9\u4E0E\u723D\u70B9\u53EA\u80FD\u6765\u81EA\u539F\u6587\u5DF2\u6709\u4FE1\u606F\u5DEE\uFF0C\u5FC5\u987B\u843D\u5230\u201C\u8C01\u8BEF\u5224\u4E86\u8C01\u3001\u539F\u6587\u63D0\u524D\u4EA4\u4EE3\u4E86\u4EC0\u4E48\u3001\u8FD9\u4E00\u62CD\u5982\u4F55\u5151\u73B0\u201D\u4E0A\u3002
- **\u8282\u594F\u94A9\u5B50:** \u82E5\u5355\u96C6\u7BC7\u5E45\u5141\u8BB8\uFF0C\u6309\u539F\u6587\u987A\u5E8F\u7EC4\u7EC7\u5173\u952E\u8282\u62CD\uFF1B\u7ED3\u5C3E\u94A9\u5B50\u53EA\u80FD\u4F7F\u7528\u539F\u6587\u5728\u8BE5\u4F4D\u7F6E\u5DF2\u7ECF\u5F62\u6210\u7684\u672A\u89E3\u51B3\u95EE\u9898\uFF0C\u4E0D\u5F97\u521B\u9020\u65B0\u60AC\u5FF5\u3002

**\u96C6\u6570\u7F16\u53F7\uFF1A\u4F60\u5FC5\u987B\u4ECE\u7B2C \${startEpisode} \u96C6\u5F00\u59CB\u7F16\u53F7\uFF1B\u5E76\u4E14\u6BCF\u96C6\u6807\u9898\u524D\u4E00\u884C\u5FC5\u987B\u5199\u6210\u5BF9\u5E94\u7684 EP\${\u96C6\u6570}\uFF08\u4F8B\u5982\u7B2C1\u96C6\u5BF9\u5E94 EP1\uFF09\u3002**

**\u5BF9\u8BDD\u8BED\u79CD\u89C4\u5219 (Dialogue Language Rule - CRITICAL):**
- **\u9ED8\u8BA4\u4FDD\u6301\u539F\u8BED\u79CD:** \u5267\u672C\u4E2D\u53CC\u5F15\u53F7 \`""\` \u5185\u7684\u5BF9\u8BDD\u5185\u5BB9\uFF0C\u9ED8\u8BA4\u4FDD\u6301\u539F\u8BED\u79CD\u4E0D\u53D8\u3002
- **\u7528\u6237\u8986\u76D6\u4F18\u5148:** \u82E5\u201C\u7528\u6237\u8865\u5145\u8981\u6C42\u201D\u660E\u786E\u6307\u5B9A\u5BF9\u767D\u8BED\u79CD\uFF08\u5982\u201C\u5BF9\u767D\u5168\u90E8\u6539\u4E3A\u82F1\u6587\u201D\uFF09\uFF0C\u5219\u5FC5\u987B\u6309\u7528\u6237\u6307\u5B9A\u6267\u884C\uFF0C\u5373\u4F7F\u4E0E\u9ED8\u8BA4\u89C4\u5219\u51B2\u7A81\u3002
- **\u975E\u5BF9\u8BDD\u5185\u5BB9:** \u52A8\u4F5C\u63CF\u8FF0\u3001\u573A\u666F\u63CF\u8FF0\u7B49\u53EF\u4EE5\u4F7F\u7528\u4E2D\u6587\u4EE5\u4FBF\u5236\u4F5C\u3002

\u53F0\u8BCD\u98CE\u683C\uFF1A
\u53CD\u6D3E\uFF1A \u77ED\u3001\u72E0\u3001\u6807\u7B7E\u5316 (\u201C\u5E9F\u7269\uFF01\u201D \u201C\u4F60\u4E5F\u914D\uFF1F\u201D \u201C\u7ED9\u6211\u6EDA\uFF01\u201D)\u3002
\u4E3B\u89D2\uFF1A \u514B\u5236\u4F46\u53E5\u53E5\u5E26\u523A\uFF0C\u5173\u952E\u65F6\u523B\u7528\u4E00\u53E5\u8BDD\u4EAE\u660E\u8EAB\u4EFD\u6216\u80FD\u529B\u3002
\u5DE5\u5177\u4EBA/\u7FA4\u50CF\uFF1A \u8D1F\u8D23\u60CA\u547C\u3001\u8D28\u7591\u3001\u89C1\u8BC1\uFF0C\u5FEB\u901F\u7AD9\u961F\u5236\u9020\u8206\u8BBA\u538B\u529B\u3002
\u753B\u9762\u5316\u6307\u4EE4\uFF1A
\u7528[\u52A8\u4F5C]\u4EE3\u66FF\u89E3\u91CA\u3002\u4F8B\u5982\uFF1A[\u4E00\u5DF4\u638C\u6247\u8FC7\u53BB]\u3001[\u6495\u6BC1\u5A5A\u4E66]\u3001[\u628A\u94B1\u7838\u5728\u5730\u4E0A]\u3002
\u7528[\u9053\u5177]\u4EE3\u66FF\u8BF4\u660E\u3002\u4F8B\u5982\uFF1A[\u7279\u5199\uFF1A\u7389\u4F69\u4E0A\u7684\u9F99\u7EB9]\u3001[\u7279\u5199\uFF1A\u5408\u540C\u4E0A\u7684\u5DE8\u989D\u6570\u5B57]\u3002
# \u4EA4\u4ED8\u524D\u68C0\u67E5\u6E05\u5355 (Final Checklist)
\u5728\u751F\u6210\u6BCF\u4E00\u96C6\u5267\u672C\u540E\uFF0C\u5FC5\u987B\u81EA\u6211\u68C0\u67E5\uFF1A
\u5F00\u573A3-5\u79D2\u662F\u5426\u5FE0\u5B9E\u627F\u63A5\u539F\u6587\u5DF2\u6709\u4E8B\u4EF6\uFF1F
\u672C\u96C6\u53CD\u8F6C/\u94A9\u5B50/\u723D\u70B9\u662F\u5426\u5168\u90E8\u6765\u81EA\u539F\u6587\uFF1F\u6CA1\u6709\u662F\u5426\u5199\u201C\u65E0\u201D\uFF1F
\u60C5\u7EEA\u7EBF\u662F\u5426\u6309\u539F\u6587\u63A8\u8FDB\uFF0C\u4E14\u6CA1\u6709\u4E3A\u4E86\u723D\u611F\u65B0\u589E\u5267\u60C5\uFF1F
\u7ED3\u5C3E\u662F\u5426\u505C\u5728\u539F\u6587\u81EA\u7136\u627F\u63A5\u70B9\uFF0C\u4E14\u6CA1\u6709\u521B\u9020\u65B0\u60AC\u5FF5\uFF1F
\u6BCF\u6761\u6E90\u53F0\u8BCD\u662F\u5426\u9010\u5B57\u8986\u76D6\u4E00\u6B21\uFF1A\u4E2D\u6587\u4E0D\u8D85\u8FC7 30 \u4E2A\u6C49\u5B57\u3001\u82F1\u6587\u4E0D\u8D85\u8FC7 18 \u4E2A\u5355\u8BCD\u6216\u7EA6 7 \u79D2\u65F6\u4FDD\u6301\u5B8C\u6574\uFF1B\u66F4\u957F\u53F0\u8BCD\u662F\u5426\u53EA\u5728\u53E5\u672B\u6807\u70B9\u6216\u5B8C\u6574\u8BED\u4E49\u4ECE\u53E5\u8FB9\u754C\u5206\u6BB5\uFF0C\u4E14\u6362\u955C\u5934\u4E0D\u5F3A\u5236\u65AD\u97F3\u3001\u5404\u6BB5\u62FC\u63A5\u5B8C\u6574\u3001\u6CA1\u6709\u91CD\u53E0\u6216\u91CD\u590D\uFF1F
\u662F\u5426\u8986\u76D6\u4E86\u539F\u6587\u6240\u6709\u56E0\u679C\u76F8\u5173\u5185\u5BB9\uFF1F
\u662F\u5426\u4FDD\u7559\u4E86\u5BFC\u6F14\u9700\u8981\u7684\u53CD\u5E94\u3001\u7EC6\u8282\u3001\u7A7A\u955C\u3001\u52A8\u4F5C\u4E0E\u8F6C\u573A\uFF0C\u540C\u65F6\u786E\u4FDD\u5B83\u4EEC\u57FA\u4E8E\u539F\u6587\u3001dialogue \u4E3A\u201C\u65E0\u201D\u4E14\u6CA1\u6709\u590D\u5236\u53F0\u8BCD\uFF1F
\u672C\u96C6\u662F\u5426\u4FDD\u7559\u4E86\u539F\u6587\u51FA\u73B0\u7684\u5168\u90E8\u4EBA\u7269\u3001\u5168\u90E8\u5BF9\u767D\u548C\u5168\u90E8\u660E\u786E\u573A\u666F\uFF1F


---
[\u8F93\u5165\u5C0F\u8BF4\u7AE0\u8282]:
"""
\${novelBatchText}
"""
---
`;

// services/postureTransitionRule.ts
var STORYBOARD_POSTURE_TRANSITION_RULE = `
${makePromptToken("storyboard.posture_transition.v1")}
`;

// services/prompts/storyboard.ts
init_utils();

// services/agentMarkdownPrompts.ts
init_utils();

// services/geminiService.ts
init_utils();
init_characterRegistry();

// services/generationTimeline.ts
init_utils();

// services/geminiService.ts
init_ffmpegService();

// services/promptSafetyLexicon.ts
init_localDataService();
init_appVersionHeaders();
init_relayAuthService();
init_relayProviderConfig();
var REMOTE_PROMPT_SAFETY_CACHE_MS = 5 * 60 * 1e3;
var SCENE_FIELD_PROMPT_SAFETY_ENTRIES = [
  { term: "\u80CC\u666F\u865A\u5316", replacement: "\u666F\u6DF1\u865A\u5316", category: "other", reason: "Pix prompt wording: avoid the background token entirely", source: "builtin" },
  { term: "\u80CC\u666F\u73AF\u5883", replacement: "\u573A\u666F\u73AF\u5883", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F\u8BBE\u5B9A", replacement: "\u573A\u666F\u8BBE\u5B9A", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F\u662F", replacement: "\u573A\u666F\u662F", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F\u5728", replacement: "\u573A\u666F\u5728", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F\uFF1A", replacement: "\u573A\u666F\uFF1A", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F:", replacement: "\u573A\u666F:", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F\u4E3A", replacement: "\u573A\u666F\u4E3A", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F\u4E2D", replacement: "\u573A\u666F\u4E2D", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F\u91CC", replacement: "\u573A\u666F\u91CC", category: "other", reason: "Pix prompt field wording: use scene for location/environment", source: "builtin" },
  { term: "\u80CC\u666F", replacement: "\u573A\u666F", category: "other", reason: "Pix prompt wording: avoid the background token entirely", source: "builtin" }
];
var CONTEXTUAL_PROMPT_SAFETY_ENTRIES = [
  ...SCENE_FIELD_PROMPT_SAFETY_ENTRIES,
  { term: "\u80F8\u90E8\u4EE5\u4E0A\u4E2D\u666F", replacement: "\u4E0A\u534A\u8EAB\u4E2D\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u80F8\u90E8\u4EE5\u4E0A\u4E2D\u8FD1\u666F", replacement: "\u4E0A\u534A\u8EAB\u4E2D\u8FD1\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u80F8\u90E8\u4EE5\u4E0A\u8FD1\u666F", replacement: "\u4E0A\u534A\u8EAB\u4E2D\u8FD1\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u80F8\u90E8\u4EE5\u4E0A\u7279\u5199", replacement: "\u5934\u80A9\u8FD1\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u80F8\u53E3\u4EE5\u4E0A\u4E2D\u666F", replacement: "\u4E0A\u534A\u8EAB\u4E2D\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u80F8\u53E3\u4EE5\u4E0A\u4E2D\u8FD1\u666F", replacement: "\u4E0A\u534A\u8EAB\u4E2D\u8FD1\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u80F8\u53E3\u4EE5\u4E0A\u8FD1\u666F", replacement: "\u4E0A\u534A\u8EAB\u4E2D\u8FD1\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u80F8\u53E3\u4EE5\u4E0A\u7279\u5199", replacement: "\u5934\u80A9\u8FD1\u666F", category: "other", reason: "camera framing wording: avoid body-part phrasing that may be misread", source: "builtin" },
  { term: "\u7956\u575F", replacement: "z\u01D4 f\xE9n", category: "occult", reason: "folklore/death wording", source: "builtin" },
  { term: "\u960E\u738B", replacement: "y\xE1n w\xE1ng", category: "occult", reason: "folklore/death wording", source: "builtin" },
  { term: "\u68FA\u6750", replacement: "gu\u0101n c\xE1i", category: "occult", reason: "death object wording", source: "builtin" },
  { term: "\u575F\u5893", replacement: "f\xE9n m\xF9", category: "occult", reason: "death location wording", source: "builtin" }
];

// services/geminiService.ts
init_relayProviderConfig();
init_relayAuthService();

// services/userAppSettingsService.ts
init_appVersionHeaders();
init_relayProviderConfig();
init_relayAuthService();
var CLOUD_APP_SETTING_KEYS = [
  "geminiProxyKeys",
  "geminiProxyUrls",
  "geminiProxySelection",
  "geminiProxyUrl",
  "cuaiApiKey",
  "minimaxApiKey",
  "minimaxGroupId",
  "minimaxModelId",
  "fishAudioApiKey",
  "fishAudioProxyUrl",
  "fishAudioModel",
  "fishAudioOptimizationEnabled",
  "elevenlabsApiKey",
  "elevenlabsModelId",
  "rhApiKeys",
  "kieApiKey",
  "jimengGlobalRelayKey",
  "seedanceApiServerUrl",
  "seedanceApiServerToken",
  "relayApiServerUrl",
  "relayApiServerToken"
];
var CLOUD_APP_SETTING_KEY_SET = new Set(CLOUD_APP_SETTING_KEYS);

// services/geminiService.ts
init_appVersionHeaders();

// config/analysisModelOptions.ts
var GPT55_VIP_TEXT_MODEL = "gpt-5.5";
var GEMINI_VIP_TEXT_MODEL = "gemini-official-3.5-flash";
var DEEPSEEK_VIP_FLASH_MODEL = "deepseek-official-v4-flash";
var DEEPSEEK_VIP_PRO_MODEL = "deepseek-official-v4-pro";
var VIP_DIRECTOR_AGENT_MODEL = "vip-director-agent";
var VIP_DIRECTOR_AGENT_MAIN_MODEL = "vip-director-agent-main";
var VIP_DIRECTOR_AGENT_APPEARANCE_MODEL = "vip-director-agent-appearance";
var VIP_DIRECTOR_AGENT_PRO_FALLBACK_MODEL = "vip-director-agent-pro-fallback";
var VIP_DIRECTOR_AGENT_MODEL_LABEL = "\u{1F48E}\u2728 \u8FB0\u5C7F\u667A\u80FD\u5BFC\u6F14";
var DEFAULT_ANALYSIS_MODEL = VIP_DIRECTOR_AGENT_MODEL;
var DEFAULT_ANALYSIS_MODEL_LABEL = VIP_DIRECTOR_AGENT_MODEL_LABEL;
var PREVIOUS_DEFAULT_ANALYSIS_MODEL = GEMINI_VIP_TEXT_MODEL;
var PREVIOUS_DEFAULT_ANALYSIS_MODEL_LABEL = "\u{1F451} Gemini VIP";
var VIP_VIDEO_ANALYSIS_MODEL = "vip-video-analysis";
var EXTERNAL_API_ANALYSIS_MODEL_OPTIONS = [
  { value: "gemini-3.6-flash", label: "Gemini 3.6 Flash" },
  { value: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash Lite" },
  { value: "gpt-5.4", label: "GPT-5.4" },
  { value: "gpt-5.4-high", label: "GPT-5.4 High" },
  { value: "gpt-5.4-mini", label: "GPT-5.4 mini" },
  { value: "gpt-5.4-nano", label: "GPT-5.4 nano" },
  { value: "grok-4.5", label: "Grok 4.5" },
  { value: "grok-4.7", label: "Grok 4.7" },
  { value: GPT55_VIP_TEXT_MODEL, label: "GPT-5.5" },
  { value: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
  { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
  { value: "gemini-3-flash-preview", label: "Gemini 3 Flash" },
  { value: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" }
];
var INTERNAL_ANALYSIS_MODEL_OPTIONS = [
  { value: DEEPSEEK_VIP_FLASH_MODEL, label: "\u{1F451} DeepSeek V4 Flash VIP" },
  { value: GEMINI_VIP_TEXT_MODEL, label: PREVIOUS_DEFAULT_ANALYSIS_MODEL_LABEL },
  { value: DEEPSEEK_VIP_PRO_MODEL, label: "\u{1F451} DeepSeek V4 Pro VIP" }
];
var SELECTABLE_DIRECT_ANALYSIS_MODEL_OPTIONS = [
  { value: DEEPSEEK_VIP_FLASH_MODEL, label: "\u{1F451} DeepSeek V4 Flash VIP" },
  { value: DEEPSEEK_VIP_PRO_MODEL, label: "\u{1F451} DeepSeek V4 Pro VIP" }
];
var HIDDEN_LEGACY_ANALYSIS_MODEL_VALUES = /* @__PURE__ */ new Set([
  PREVIOUS_DEFAULT_ANALYSIS_MODEL,
  VIP_DIRECTOR_AGENT_MAIN_MODEL,
  VIP_DIRECTOR_AGENT_APPEARANCE_MODEL,
  VIP_DIRECTOR_AGENT_PRO_FALLBACK_MODEL,
  "deepseek-v3.2",
  "deepseek-v3.2-fast",
  "deepseek-v3.2-thinking",
  "deepseek-v4-flash",
  "deepseek-v4-pro",
  "claude-sonnet-4-6",
  "claude-opus-4-6",
  "claude-opus-4-7",
  "MiniMax-M2.5",
  // 下拉里已移除的档位: 老设置里存着的值在这里归一回辰屿智能导演,
  // 否则删了下拉也没用 —— 已经选过 Gemini 3 Flash / V4 Pro 的用户会一直停在原值上。
  ...SELECTABLE_DIRECT_ANALYSIS_MODEL_OPTIONS.map((item) => item.value),
  ...EXTERNAL_API_ANALYSIS_MODEL_OPTIONS.map((item) => item.value),
  ...INTERNAL_ANALYSIS_MODEL_OPTIONS.map((item) => item.value)
]);
var ANALYSIS_MODEL_OPTIONS = [
  { value: DEFAULT_ANALYSIS_MODEL, label: DEFAULT_ANALYSIS_MODEL_LABEL }
];
var ADVANCED_ANALYSIS_MODEL_OPTIONS = [
  ...ANALYSIS_MODEL_OPTIONS
];
var VIDEO_ANALYSIS_MODEL_OPTIONS = [
  { value: VIP_VIDEO_ANALYSIS_MODEL, label: "VIP \u591A\u6A21\u6001\u5206\u6790" }
];
var ADVANCED_VIDEO_ANALYSIS_MODEL_OPTIONS = [
  ...VIDEO_ANALYSIS_MODEL_OPTIONS,
  { value: DEFAULT_ANALYSIS_MODEL, label: DEFAULT_ANALYSIS_MODEL_LABEL }
];
var VALID_TEXT_ANALYSIS_MODELS = [
  DEFAULT_ANALYSIS_MODEL,
  ...SELECTABLE_DIRECT_ANALYSIS_MODEL_OPTIONS.map((item) => item.value),
  ...EXTERNAL_API_ANALYSIS_MODEL_OPTIONS.map((item) => item.value),
  ...INTERNAL_ANALYSIS_MODEL_OPTIONS.map((item) => item.value),
  VIP_DIRECTOR_AGENT_MAIN_MODEL,
  VIP_DIRECTOR_AGENT_APPEARANCE_MODEL,
  VIP_DIRECTOR_AGENT_PRO_FALLBACK_MODEL,
  "gemini-3-flash-preview-proxy",
  "gemini-3.1-pro-preview-proxy"
];
var VALID_VIDEO_ANALYSIS_MODELS = [
  VIP_VIDEO_ANALYSIS_MODEL,
  DEFAULT_ANALYSIS_MODEL,
  ...EXTERNAL_API_ANALYSIS_MODEL_OPTIONS.map((item) => item.value),
  ...INTERNAL_ANALYSIS_MODEL_OPTIONS.map((item) => item.value),
  "gemini-3-flash-preview-proxy"
];

// services/geminiService.ts
init_assetPromptQuality();

// services/clientMediaUploadService.ts
init_appVersionHeaders();
init_relayAuthService();
init_relayProviderConfig();
var SIGNED_URL_REUSE_GRACE_MS = 5 * 60 * 1e3;
var FALLBACK_SIGNED_URL_TTL_MS = 6 * 60 * 60 * 1e3;
var SIGNED_UPLOAD_REQUEST_TIMEOUT_MS = 30 * 1e3;
var BUCKET_UPLOAD_MIN_TIMEOUT_MS = 5 * 60 * 1e3;
var BUCKET_UPLOAD_MAX_TIMEOUT_MS = 2 * 60 * 60 * 1e3;
var CLIENT_MEDIA_HASH_MAX_BYTES = 256 * 1024 * 1024;
var SIGNED_DOWNLOAD_REQUEST_TIMEOUT_MS = 30 * 1e3;
var CLIENT_MEDIA_IMAGE_DECODE_TIMEOUT_MS = 15 * 1e3;

// services/scriptAgentKnowledgeService.ts
init_appVersionHeaders();
init_relayAuthService();
init_relayProviderConfig();

// services/shotAssetAgentCore.ts
init_utils();

// services/clientSiteConfigService.ts
init_appVersionHeaders();
init_relayProviderConfig();
init_relayAuthService();

// services/applyOriginalAiQaRepair.ts
var APPLY_ORIGINAL_AI_QA_REPAIR_INSTRUCTION = `
APPLY_ORIGINAL_AI_QA_REPAIR:
- Treat the complete original episode below as the only source of truth. Inspect and repair every SHOT against that original script.
- Compare the candidate storyboard against the complete original episode, then directly output the fully repaired storyboard. Do not return only an issue list or leave known defects unfixed.
- QA must restore every plot beat that exists in the original script but is missing from the candidate, including source-required dialogue, actions, evidence changes, reveals, transitions, and the ending hook.
- QA must not invent or add plot content that is absent from the original script. Source restoration is required; source-external creation is forbidden.
- QA may correct existing SHOTs and all other QA defects. QA may add or refine non-plot visual action, staging, expressions, character reactions, atmosphere, transitions, camera language, tags, and formatting when they faithfully express the existing source plot.
- Correct rewritten dialogue, wrong speakers, source-order errors, invented content, and occurrences repeated more times than the source.
- Identical source lines are occurrence-based: preserve every real occurrence and remove only output occurrences beyond the source.
- Long dialogue may be split across consecutive SHOTs, but the dialogue fragments must concatenate to the exact original line without overlap, omission, paraphrase, or speaker change.
- Every explicit named phone, recording, voicemail, intercom, radio, or other remote-channel speaker turn is source dialogue and must be restored exactly once in source order. Keep an invisible remote speaker out of charactersInShot, but retain the approved speaker/TTS tag in dialogue with a round-parentheses channel cue such as\uFF08\u7535\u8BDD\u753B\u5916\u97F3\uFF09. Never equate \u201Cnot visible\u201D with \u201Csilent\u201D.
- SHOT structure may be adjusted when necessary to restore complete source coverage and repair defects, but no structure edit may introduce plot content absent from the original script.
- Use only legal declared character appearance tags for speakers and visible characters. When the source explicitly names a speaker, bind that dialogue to that speaker.
- The final SHOT sequence must cover the complete original episode through its real ending. Restore a missing source ending, but never manufacture a source-external ending.
`.trim();

// services/characterColorAnchors.ts
var colorBackfillRegistry = globalThis.__pumpColorBackfillRegistry ||= { entries: [], inflight: /* @__PURE__ */ new Map() };

// services/geminiService.ts
var GLOBAL_ABORT_SCOPE = "__global__";
var VISUAL_ENHANCE_EYE_LIGHT_GUARD = makePromptToken("visual.eye_light_guard");
var inFlightControllers = /* @__PURE__ */ new Set();
var inFlightControllersByScope = /* @__PURE__ */ new Map();
var controllerScopeMap = /* @__PURE__ */ new WeakMap();
var abortedScopes = /* @__PURE__ */ new Map();
var CHINESE_NAME_PRESERVATION_OVERRIDE_BLOCK = makePromptToken("optimize.cn_name_preserve");
var normalizeAbortScope = (scope) => {
  const normalized = String(scope || "").trim();
  return normalized || GLOBAL_ABORT_SCOPE;
};
var abortInFlightRequestsByScope = (scope, reason = "cancelled") => {
  const normalizedScope = normalizeAbortScope(scope);
  abortedScopes.set(normalizedScope, reason);
  const bucket = inFlightControllersByScope.get(normalizedScope);
  if (!bucket || bucket.size === 0) return;
  const targets = Array.from(bucket);
  targets.forEach((controller) => {
    try {
      controller.abort(new DOMException(reason, "AbortError"));
    } catch {
      controller.abort();
    }
    inFlightControllers.delete(controller);
    controllerScopeMap.delete(controller);
    bucket.delete(controller);
  });
  if (bucket.size === 0) {
    inFlightControllersByScope.delete(normalizedScope);
  }
};
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    Array.from(inFlightControllersByScope.keys()).forEach((scope) => abortInFlightRequestsByScope(scope, "llm-service-replaced"));
  });
}
var PROMPT_SAFETY_POLICY_BLOCK = makePromptToken("optimize.safety_policy");
var PROMPT_IP_DEIDENTIFY_POLICY_BLOCK = makePromptToken("optimize.ip_deidentify");

// services/storyboardAgentWorkflow.ts
init_characterRegistry();

// services/characterStylingAgent.ts
init_characterAgeIndex();

// services/characterStylingWardrobeCapsulesExtra.ts
var slot = (detail, material = detail) => ({
  label: detail.slice(0, 18),
  material,
  detail
});
var slots = (inner, top, bottom, outerwear, legwear, shoes, accessory) => ({
  inner: slot(inner),
  top: slot(top),
  bottom: slot(bottom),
  outerwear: slot(outerwear),
  legwear: slot(legwear),
  shoes: slot(shoes),
  accessory: slot(accessory)
});
var capsule = (id, label, gender, eras, roleTags, summary, capsuleSlots, ageBands) => ({
  id,
  label,
  gender,
  eras,
  roleTags,
  summary,
  ageBands,
  slots: capsuleSlots
});
var EXTRA_WARDROBE_CAPSULES = [
  capsule("career-male-pinstripe-villain", "\u9ED1\u8272\u7EC6\u6761\u7EB9\u75AF\u6279\u897F\u88C5", "male", ["modern", "career"], ["\u9738\u603B", "\u7537\u53CD", "\u75AF\u6279", "\u8C6A\u95E8", "\u603B\u88C1", "\u7EE7\u627F\u4EBA"], "\u77ED\u5267\u75AF\u6279\u7537\u53CD\u6216\u8C6A\u95E8\u7EE7\u627F\u4EBA\uFF0C\u9ED1\u8272\u7EC6\u6761\u7EB9\u897F\u88C5\u3001\u767D\u886C\u886B\u9ED1\u9886\u5E26\uFF0C\u51B7\u611F\u3001\u8D35\u6C14\u3001\u538B\u8FEB\u611F\u5F3A\u3002", slots("\u767D\u8272\u9AD8\u652F\u68C9\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u8896\u53E3\u9732\u51FA\u5C11\u91CF\u767D\u8FB9", "\u9ED1\u8272\u4FEE\u8EAB\u9A6C\u7532\u6216\u8D34\u8EAB\u897F\u88C5\u4E0A\u5C42\uFF0C\u7EC6\u7AD6\u6761\u7EB9\uFF0C\u80F8\u8170\u7EBF\u6E05\u695A", "\u9ED1\u8272\u7EC6\u6761\u7EB9\u9AD8\u8170\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u88E4\u811A\u81EA\u7136\u843D\u5728\u978B\u9762", "\u9ED1\u8272\u7EC6\u6761\u7EB9\u9AD8\u5B9A\u897F\u88C5\u5916\u5957\uFF0C\u7A84\u7FFB\u9886\uFF0C\u80A9\u7EBF\u786C\u633A\uFF0C\u8170\u8EAB\u6536\u7A84", "\u6DF1\u8272\u889C\u6750\u9690\u85CF\u5728\u88E4\u811A\u4E0B\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u817F\u6BD4\u4F8B\u548C\u88E4\u7EBF", "\u9ED1\u8272\u629B\u5149\u725B\u6D25\u76AE\u978B\uFF0C\u978B\u578B\u4FEE\u957F\uFF0C\u4F4E\u53CD\u5149\u9AD8\u8D28\u611F", "\u9ED1\u8272\u7A84\u9886\u5E26\u3001\u94F6\u8272\u8033\u9489\u6216\u6781\u7B80\u8896\u6263\u3001\u65E0\u624B\u6301\u7269\u65E0Logo"), ["21-28", "29-38", "39-50"]),
  capsule("career-male-black-satin-tuxedo", "\u9ED1\u7F0E\u9762\u51B7\u611F\u793C\u670D\u897F\u88C5", "male", ["modern", "career"], ["\u665A\u5BB4", "\u540D\u6D41", "\u7537\u53CD", "\u8C6A\u95E8", "\u603B\u88C1", "\u7EE7\u627F\u4EBA"], "\u665A\u5BB4\u3001\u8BA2\u5A5A\u5BB4\u3001\u5546\u4E1A\u9152\u4F1A\u91CC\u7684\u51B7\u611F\u540D\u6D41\u7537\u89D2\u8272\uFF0C\u9ED1\u8272\u7F0E\u9762\u793C\u670D\u897F\u88C5\uFF0C\u514B\u5236\u5962\u534E\u3002", slots("\u767D\u8272\u793C\u670D\u886C\u886B\uFF0C\u80F8\u524D\u8936\u4F4D\u7EC6\u5BC6\uFF0C\u9886\u53E3\u5E72\u51C0", "\u9ED1\u8272\u4FEE\u8EAB\u793C\u670D\u9A6C\u7532\uFF0C\u5E03\u9762\u4F4E\u5149\uFF0C\u8170\u7EBF\u660E\u786E", "\u9ED1\u8272\u793C\u670D\u897F\u88E4\uFF0C\u88E4\u7EBF\u9510\u5229\uFF0C\u5782\u5760\u987A\u76F4", "\u9ED1\u8272\u7F0E\u9762\u7FFB\u9886\u793C\u670D\u5916\u5957\uFF0C\u80A9\u7EBF\u5E73\u76F4\uFF0C\u8170\u8EAB\u6536\u7A84", "\u9ED1\u8272\u8584\u889C\u9690\u85CF\u5728\u88E4\u811A\u4E0B\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u4EAE\u9762\u5FB7\u6BD4\u978B\u6216\u725B\u6D25\u978B\uFF0C\u978B\u9762\u65E0Logo", "\u9ED1\u8272\u9886\u7ED3\u6216\u7A84\u9886\u5E26\u3001\u8896\u6263\u3001\u65E0\u9152\u676F\u65E0\u9EA6\u514B\u98CE\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("modern-male-rich-heir-leather", "\u8C6A\u95E8\u7EE7\u627F\u4EBA\u9ED1\u76AE\u5939\u514B\u5957\u88C5", "male", ["modern", "career"], ["\u5BCC\u4E8C\u4EE3", "\u7EE7\u627F\u4EBA", "\u7537\u53CD", "\u53DB\u9006", "\u90FD\u5E02", "\u75AF\u6279"], "\u53DB\u9006\u8C6A\u95E8\u7EE7\u627F\u4EBA\u6216\u5371\u9669\u7537\u4E8C\uFF0C\u9ED1\u8272\u77ED\u76AE\u5939\u514B\u3001\u6DF1\u8272\u5185\u642D\u548C\u4FEE\u8EAB\u957F\u88E4\uFF0C\u90FD\u5E02\u538B\u8FEB\u611F\u5F3A\u3002", slots("\u6DF1\u7070\u6216\u9ED1\u8272\u9AD8\u9886\u9488\u7EC7\u5185\u642D\uFF0C\u8D34\u5408\u80A9\u9888\uFF0C\u9886\u53E3\u5B89\u5168", "\u9ED1\u8272\u77ED\u6B3E\u76AE\u5939\u514B\u4E0A\u5C42\uFF0C\u62C9\u94FE\u548C\u62FC\u63A5\u7EBF\u6E05\u695A\uFF0C\u80A9\u7EBF\u5229\u843D", "\u9ED1\u8272\u4FEE\u8EAB\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u5E72\u51C0\uFF0C\u817F\u90E8\u6BD4\u4F8B\u62C9\u957F", "\u9ED1\u8272\u673A\u8F66\u611F\u77ED\u5916\u5957\uFF0C\u76AE\u9769\u4F4E\u5149\u6CFD\uFF0C\u4E0D\u5938\u5F20\u94C6\u9489", "\u9ED1\u8272\u889C\u6750\u9690\u85CF\u5728\u978B\u53E3\u5185\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u5207\u5C14\u897F\u9774\u6216\u539A\u5E95\u76AE\u978B\uFF0C\u978B\u578B\u4FEE\u957F", "\u94F6\u8272\u8033\u9AA8\u5939\u3001\u7EC6\u6212\u6307\u3001\u76AE\u5E26\uFF0C\u65E0\u624B\u673A\u65E0\u70DF\u9152\u624B\u6301"), ["21-28", "29-38"]),
  capsule("career-female-pinstripe-power", "\u9ED1\u8272\u7EC6\u6761\u7EB9\u5973\u5F3A\u4EBA\u897F\u88C5", "female", ["modern", "career"], ["\u5973\u603B\u88C1", "\u5973\u53CD", "\u5F8B\u5E08", "\u804C\u4E1A", "\u8C6A\u95E8", "\u540D\u5A9B"], "\u77ED\u5267\u5973\u603B\u88C1\u6216\u5973\u53CD\u7684\u5F3A\u52BF\u804C\u4E1A\u5F62\u8C61\uFF0C\u9ED1\u8272\u7EC6\u6761\u7EB9\u897F\u88C5\u3001\u767D\u886C\u886B\uFF0C\u950B\u5229\u3001\u5E72\u7EC3\u3001\u538B\u8FEB\u611F\u5F3A\u3002", slots("\u767D\u8272\u4FEE\u8EAB\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u80F8\u524D\u65E0\u6587\u5B57", "\u9ED1\u8272\u7EC6\u6761\u7EB9\u6536\u8170\u897F\u88C5\u4E0A\u5C42\uFF0C\u80A9\u7EBF\u786C\u633A\uFF0C\u8170\u7EBF\u660E\u786E", "\u9ED1\u8272\u9AD8\u8170\u76F4\u7B52\u897F\u88E4\u6216\u8FC7\u819D\u94C5\u7B14\u88D9\uFF0C\u5782\u5760\u5229\u843D", "\u9ED1\u8272\u7EC6\u6761\u7EB9\u77ED\u897F\u88C5\u5916\u5957\uFF0C\u7A84\u7FFB\u9886\uFF0C\u8896\u53E3\u5E72\u51C0", "\u81EA\u7136\u80A4\u8272\u817F\u90E8\u6216\u9ED1\u8272\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u5C16\u5934\u9AD8\u8DDF\u978B\uFF0C\u978B\u9762\u65E0Logo", "\u7EC6\u91D1\u5C5E\u8033\u9970\u3001\u8155\u8868\u6216\u80F8\u9488\u3001\u65E0\u6587\u4EF6\u65E0\u624B\u673A\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("modern-female-glossy-black-red", "\u9ED1\u7EA2\u4EAE\u9762\u75AF\u6279\u5973\u53CD\u5957\u88C5", "female", ["modern", "career"], ["\u5973\u53CD", "\u75AF\u6279", "\u540D\u5A9B", "\u7F51\u7EA2", "\u8C6A\u95E8", "\u5343\u91D1"], "\u9AD8\u8FA8\u8BC6\u5EA6\u77ED\u5267\u5973\u53CD\u6216\u540D\u5A9B\u5343\u91D1\uFF0C\u9ED1\u7EA2\u4F4E\u5149\u4EAE\u9762\u5957\u88C5\uFF0C\u5371\u9669\u3001\u8D35\u6C14\u3001\u9002\u5408\u5F3A\u51B2\u7A81\u573A\u666F\u3002", slots("\u9ED1\u8272\u4FEE\u8EAB\u9488\u7EC7\u5185\u642D\uFF0C\u9886\u53E3\u5B89\u5168\uFF0C\u54D1\u5149\u8D28\u611F", "\u6697\u7EA2\u77ED\u6B3E\u5916\u5957\u6216\u9ED1\u7EA2\u62FC\u63A5\u4E0A\u5C42\uFF0C\u8170\u7EBF\u6E05\u695A\uFF0C\u91D1\u5C5E\u6263\u4F4E\u8C03", "\u9ED1\u8272\u9AD8\u8170\u957F\u88E4\u6216\u6697\u7EA2\u5305\u81C0\u534A\u88D9\uFF0C\u6BD4\u4F8B\u62C9\u957F\uFF0C\u526A\u88C1\u5229\u843D", "\u9ED1\u8272\u77ED\u62AB\u80A9\u6216\u76AE\u8D28\u5916\u5C42\uFF0C\u4F4E\u5149\u6CFD\uFF0C\u4E0D\u906E\u8170\u7EBF", "\u81EA\u7136\u80A4\u8272\u817F\u90E8\u6216\u9ED1\u8272\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u5C16\u5934\u9AD8\u8DDF\u978B\u6216\u539A\u5E95\u77ED\u9774\uFF0C\u978B\u9762\u65E0Logo", "\u7EA2\u5B9D\u77F3\u611F\u8033\u9970\u3001\u7EC6\u9879\u94FE\u3001\u53D1\u5939\uFF0C\u65E0\u624B\u6301\u9053\u5177"), ["21-28", "29-38"]),
  capsule("republican-male-officer-khaki", "\u6C11\u56FD\u519B\u5B98\u5361\u5176\u5236\u670D", "male", ["republican", "period"], ["\u519B\u5B98", "\u6C11\u56FD", "\u6743\u529B", "\u786C\u6C49"], "\u6C11\u56FD\u519B\u5B98\u6216\u519B\u9600\u526F\u5B98\uFF0C\u5361\u5176\u5236\u670D\u3001\u76AE\u9769\u88C5\u5907\u3001\u5F3A\u538B\u8FEB\u611F\u3002", slots("\u7C73\u767D\u7ACB\u9886\u886C\u8863\uFF0C\u68C9\u5E03\u633A\u62EC\uFF0C\u9886\u53E3\u5E72\u51C0", "\u5361\u5176\u77ED\u6B3E\u519B\u88C5\u4E0A\u8863\uFF0C\u80A9\u7AE0\u4F4E\u8C03\u65E0\u6587\u5B57\uFF0C\u80F8\u888B\u6E05\u6670", "\u6DF1\u5361\u5176\u76F4\u7B52\u519B\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u819D\u90E8\u81EA\u7136\u8936\u76B1", "\u6A44\u6984\u5361\u5176\u519B\u5927\u8863\u62AB\u80A9\u5F0F\u5916\u5C42\uFF0C\u7FFB\u9886\u786C\u633A", "\u7ED1\u817F\u5E03\u6216\u6DF1\u8272\u62A4\u817F\uFF0C\u7F20\u7ED5\u5C42\u6B21\u6E05\u695A", "\u68D5\u9ED1\u9AD8\u7B52\u519B\u9774\uFF0C\u76AE\u9769\u78E8\u65E7\u4F46\u5E72\u51C0", "\u76AE\u5E26\u3001\u624B\u5957\u3001\u65E0\u53EF\u8BFB\u5FBD\u7AE0\u65E0\u6B66\u5668"), ["21-28", "29-38", "39-50"]),
  capsule("republican-male-patrol-inspector", "\u6C11\u56FD\u5DE1\u6355\u5236\u670D", "male", ["republican", "period"], ["\u5DE1\u6355", "\u8B66\u5BDF", "\u6C11\u56FD", "\u804C\u4E1A"], "\u79DF\u754C\u5DE1\u6355\u6216\u65E7\u5F0F\u8B66\u5BDF\uFF0C\u6DF1\u84DD\u5236\u670D\u3001\u94DC\u6263\u3001\u514B\u5236\u5A01\u4E25\u3002", slots("\u767D\u8272\u68C9\u886C\u8863\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u8896\u53E3\u6536\u51C0", "\u6DF1\u84DD\u5DE1\u6355\u5236\u670D\u4E0A\u8863\uFF0C\u94DC\u6263\u6392\u5217\u6E05\u695A\uFF0C\u65E0\u53EF\u8BFB\u7F16\u53F7", "\u6DF1\u84DD\u76F4\u7B52\u5236\u670D\u88E4\uFF0C\u88E4\u811A\u81EA\u7136\u843D\u5728\u9774\u9762", "\u9ED1\u84DD\u77ED\u6597\u7BF7\u5F0F\u5916\u5957\uFF0C\u80A9\u7EBF\u5BBD\u800C\u5229\u843D", "\u6DF1\u8272\u62A4\u817F\u5E03\u5E26\uFF0C\u4F4E\u53CD\u5149\u5E03\u9762", "\u9ED1\u8272\u77ED\u9774\uFF0C\u978B\u5934\u5706\u6DA6\uFF0C\u884C\u52A8\u611F\u5F3A", "\u76AE\u8D28\u8170\u5E26\u3001\u65E7\u5F0F\u54E8\u7EF3\u3001\u65E0\u67AA\u68B0\u65E0\u6587\u5B57"), ["21-28", "29-38", "39-50"]),
  capsule("republican-male-newspaper-reporter", "\u6C11\u56FD\u62A5\u793E\u8BB0\u8005\u957F\u886B\u9A6C\u7532", "male", ["republican", "period"], ["\u8BB0\u8005", "\u62A5\u793E", "\u6587\u4EBA", "\u6C11\u56FD"], "\u6C11\u56FD\u62A5\u793E\u8BB0\u8005\u6216\u8FDB\u6B65\u9752\u5E74\uFF0C\u957F\u886B\u4E0E\u9A6C\u7532\u7ED3\u5408\uFF0C\u5E72\u7EC3\u6709\u4E66\u5377\u6C14\u3002", slots("\u7070\u767D\u7ACB\u9886\u5185\u886B\uFF0C\u68C9\u9EBB\u6750\u8D28\uFF0C\u9886\u53E3\u5E73\u6574", "\u6DF1\u7070\u9A6C\u7532\uFF0C\u5E03\u6263\u7EC6\u5BC6\uFF0C\u80F8\u7EBF\u514B\u5236", "\u9ED1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u5E03\u9762\u6709\u8F7B\u5FAE\u8936\u75D5", "\u6D45\u7070\u957F\u886B\u5916\u5C42\uFF0C\u5F00\u8869\u81EA\u7136\uFF0C\u884C\u52A8\u65B9\u4FBF", "\u6DF1\u8272\u4F4E\u5E2E\u889C\u6750\uFF0C\u9690\u85CF\u5728\u88E4\u811A\u4E0B", "\u9ED1\u8272\u5E03\u978B\u6216\u4F4E\u5E2E\u76AE\u978B\uFF0C\u78E8\u65E7\u4F4E\u53CD\u5149", "\u65E7\u6000\u8868\u94FE\u3001\u65E0\u62A5\u7EB8\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("republican-male-chamber-boss-silk", "\u6C11\u56FD\u5546\u4F1A\u8001\u677F\u957F\u888D", "male", ["republican", "period"], ["\u5546\u4F1A\u8001\u677F", "\u5546\u8D3E", "\u5BB6\u4E3B", "\u6C11\u56FD"], "\u6C11\u56FD\u5546\u4F1A\u4F1A\u957F\u6216\u5BCC\u5546\uFF0C\u6DF1\u8272\u7EF8\u7F0E\u957F\u888D\u3001\u7A33\u91CD\u8D35\u6C14\u3002", slots("\u8C61\u7259\u767D\u4E2D\u5F0F\u5185\u886B\uFF0C\u9886\u53E3\u7EC6\u6263", "\u6DF1\u68D5\u7EF8\u7F0E\u9A6C\u8902\uFF0C\u6697\u7EB9\u7EC6\u817B\uFF0C\u80A9\u80CC\u7A33\u91CD", "\u9ED1\u8272\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u9690\u85CF\u5728\u957F\u888D\u4E0B", "\u58A8\u9ED1\u957F\u888D\u5916\u5C42\uFF0C\u7F0E\u9762\u67D4\u5149\uFF0C\u7FFB\u8FB9\u539A\u5B9E", "\u6DF1\u8272\u957F\u889C\uFF0C\u4E0D\u62A2\u89C6\u89C9", "\u9ED1\u8272\u5706\u53E3\u5E03\u978B\uFF0C\u978B\u9762\u5E72\u51C0", "\u7389\u6273\u6307\u3001\u6000\u8868\u94FE\u3001\u65E0\u53EF\u8BFB\u5546\u6807"), ["39-50", "51-65"]),
  capsule("republican-female-dancehall-singer", "\u6C11\u56FD\u821E\u5385\u6B4C\u5973\u4EAE\u7247\u65D7\u888D", "female", ["republican", "period"], ["\u6B4C\u5973", "\u821E\u5385", "\u6C11\u56FD", "\u5973\u53CD"], "\u6C11\u56FD\u821E\u5385\u6B4C\u5973\uFF0C\u4EAE\u7247\u65D7\u888D\u3001\u5377\u53D1\u914D\u9970\u3001\u534E\u4E3D\u4F46\u4E0D\u8FC7\u5EA6\u66B4\u9732\u3002", slots("\u6D45\u91D1\u540A\u5E26\u5185\u5C42\uFF0C\u7F0E\u9762\u67D4\u5149\uFF0C\u9886\u53E3\u5B89\u5168", "\u6697\u7EA2\u8D34\u8EAB\u65D7\u888D\u4E0A\u8EAB\uFF0C\u7EC6\u5BC6\u4EAE\u7247\uFF0C\u80A9\u9888\u7EBF\u5E72\u51C0", "\u6697\u7EA2\u65D7\u888D\u4E0B\u6446\uFF0C\u5F00\u8869\u514B\u5236\uFF0C\u5E03\u6599\u5782\u5760", "\u9ED1\u8272\u77ED\u62AB\u80A9\uFF0C\u7ED2\u9762\u6750\u8D28\uFF0C\u5305\u4F4F\u80A9\u7EBF", "\u81EA\u7136\u80A4\u8272\u817F\u90E8\u6216\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u7EC6\u8DDF\u821E\u978B\uFF0C\u5706\u5934\uFF0C\u978B\u9762\u4EAE\u6CFD", "\u73CD\u73E0\u8033\u5760\u3001\u53D1\u5939\u3001\u65E0\u9EA6\u514B\u98CE\u65E0\u9999\u70DF"), ["21-28", "29-38"]),
  capsule("republican-male-dock-worker-canvas", "\u6C11\u56FD\u7801\u5934\u5DE5\u4EBA\u7C97\u5E03\u88C5", "male", ["republican", "period"], ["\u7801\u5934\u5DE5\u4EBA", "\u5DE5\u4EBA", "\u5E95\u5C42", "\u6C11\u56FD"], "\u6C11\u56FD\u7801\u5934\u5DE5\u4EBA\u6216\u82E6\u529B\uFF0C\u7C97\u5E03\u77ED\u8902\u3001\u6C57\u5DFE\u3001\u52B3\u4F5C\u611F\u771F\u5B9E\u3002", slots("\u7070\u767D\u6C57\u886B\uFF0C\u68C9\u5E03\u5438\u6C57\uFF0C\u6709\u81EA\u7136\u65E7\u75D5", "\u8910\u8272\u7C97\u5E03\u77ED\u8902\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u80A9\u80CC\u7ED3\u5B9E", "\u6DF1\u7070\u5BBD\u677E\u957F\u88E4\uFF0C\u88E4\u811A\u624E\u7D27\uFF0C\u5E03\u9762\u78E8\u635F", "\u65E7\u84DD\u5E03\u5916\u642D\u642D\u5728\u80A9\u80CC\uFF0C\u4E0D\u906E\u6321\u4F53\u578B", "\u7ED1\u817F\u5E03\uFF0C\u7F20\u7ED5\u4E0D\u6574\u9F50\u4F46\u771F\u5B9E", "\u9ED1\u8272\u5E03\u978B\uFF0C\u978B\u5E95\u539A\uFF0C\u6CBE\u7070\u4F46\u4E0D\u810F\u4E71", "\u6BDB\u5DFE\u3001\u9EBB\u7EF3\u8170\u5E26\u3001\u65E0\u8D27\u7269\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("republican-female-student-blue", "\u6C11\u56FD\u5973\u5B66\u751F\u84DD\u5E03\u886B\u9ED1\u88D9", "female", ["republican", "period", "campus"], ["\u5973\u5B66\u751F", "\u6821\u56ED", "\u6C11\u56FD", "\u767D\u6708\u5149"], "\u6C11\u56FD\u5973\u5B66\u751F\uFF0C\u84DD\u5E03\u886B\u9ED1\u88D9\uFF0C\u5E72\u51C0\u3001\u6E05\u7EAF\u3001\u65F6\u4EE3\u611F\u660E\u786E\u3002", slots("\u767D\u8272\u68C9\u8D28\u5185\u886B\uFF0C\u9886\u53E3\u5E73\u6574", "\u6D45\u84DD\u659C\u895F\u5B66\u751F\u5E03\u886B\uFF0C\u7EBD\u6263\u7EC6\u5C0F\uFF0C\u8896\u53E3\u5E72\u51C0", "\u9ED1\u8272\u53CA\u819D\u767E\u8936\u88D9\uFF0C\u8936\u7EBF\u6E05\u695A\uFF0C\u5E03\u6599\u633A\u62EC", "\u7C73\u767D\u8584\u9488\u7EC7\u5F00\u886B\uFF0C\u77ED\u6B3E\u4E0D\u538B\u8EAB\u9AD8", "\u767D\u8272\u77ED\u889C\uFF0C\u5E72\u51C0\u4F4E\u53CD\u5149", "\u9ED1\u8272\u5706\u5934\u5E03\u978B\uFF0C\u5B66\u751F\u611F\u5F3A", "\u7D20\u8272\u53D1\u5E26\u3001\u7EC6\u4E66\u5305\u80A9\u5E26\u3001\u65E0\u4E66\u672C\u624B\u6301"), ["16-20", "21-28"]),
  capsule("republican-female-qipao-madam-ink", "\u6C11\u56FD\u65D7\u888D\u592A\u592A\u58A8\u7EFF\u62AB\u80A9", "female", ["republican", "period"], ["\u592A\u592A", "\u65D7\u888D", "\u8C6A\u95E8", "\u6C11\u56FD"], "\u6C11\u56FD\u8C6A\u95E8\u592A\u592A\u6216\u5546\u8D3E\u592B\u4EBA\uFF0C\u58A8\u7EFF\u65D7\u888D\u3001\u62AB\u80A9\u3001\u6210\u719F\u8D35\u6C14\u3002", slots("\u7C73\u767D\u4E1D\u8D28\u5185\u5C42\uFF0C\u9886\u53E3\u8D34\u5408", "\u58A8\u7EFF\u9AD8\u9886\u65D7\u888D\u4E0A\u8EAB\uFF0C\u76D8\u6263\u7CBE\u81F4\uFF0C\u6697\u7EB9\u4F4E\u8C03", "\u58A8\u7EFF\u65D7\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u987A\u6ED1\uFF0C\u5F00\u8869\u4FDD\u5B88", "\u7C73\u91D1\u7F8A\u6BDB\u62AB\u80A9\uFF0C\u8FB9\u7F18\u7EC6\u7ED2\uFF0C\u642D\u5728\u80A9\u4E0A", "\u81EA\u7136\u80A4\u8272\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u58A8\u7EFF\u4F4E\u8DDF\u76AE\u978B\uFF0C\u978B\u578B\u4FEE\u957F", "\u73CD\u73E0\u9879\u94FE\u3001\u7389\u956F\u3001\u65E0\u624B\u5305\u65E0\u6247\u5B50"), ["29-38", "39-50", "51-65"]),
  capsule("ancient-male-imperial-doctor-blue", "\u53E4\u88C5\u592A\u533B\u9752\u84DD\u5B98\u670D", "male", ["ancient", "period"], ["\u592A\u533B", "\u533B\u751F", "\u53E4\u88C5\u804C\u4E1A", "\u6587\u5B98"], "\u5BAB\u5EF7\u592A\u533B\u6216\u533B\u5B98\uFF0C\u9752\u84DD\u5B98\u670D\u3001\u836F\u7BB1\u611F\u8F6C\u4E3A\u8170\u95F4\u914D\u9970\uFF0C\u4E0D\u624B\u6301\u9053\u5177\u3002", slots("\u767D\u8272\u4EA4\u9886\u4E2D\u8863\uFF0C\u68C9\u9EBB\u67D4\u5149\uFF0C\u9886\u53E3\u5C42\u6B21\u6E05\u695A", "\u9752\u84DD\u5706\u9886\u5B98\u670D\u4E0A\u8EAB\uFF0C\u5E03\u9762\u7EC6\u5BC6\uFF0C\u80A9\u7EBF\u7AEF\u6B63", "\u6DF1\u84DD\u5BBD\u888D\u4E0B\u6446\uFF0C\u8936\u76B1\u5782\u76F4\uFF0C\u884C\u52A8\u514B\u5236", "\u85CF\u84DD\u8584\u62AB\u98CE\u5916\u5C42\uFF0C\u8FB9\u7F18\u6EDA\u9ED1\u8FB9", "\u9ED1\u8272\u5E03\u889C\uFF0C\u85CF\u5728\u957F\u888D\u4E0B", "\u9ED1\u8272\u4E91\u5934\u5E03\u9774\uFF0C\u978B\u9762\u5E72\u51C0", "\u7D20\u8272\u8170\u724C\u3001\u836F\u56CA\u6302\u9970\u3001\u65E0\u624B\u6301\u836F\u7BB1"), ["29-38", "39-50", "51-65"]),
  capsule("ancient-female-medicine-maid-teal", "\u53E4\u88C5\u533B\u5973\u9752\u7EFF\u77ED\u8884", "female", ["ancient", "period"], ["\u533B\u5973", "\u533B\u751F", "\u53E4\u88C5\u804C\u4E1A", "\u5973\u4E3B"], "\u53E4\u88C5\u533B\u5973\u6216\u836F\u5E90\u5973\u4E3B\uFF0C\u9752\u7EFF\u77ED\u8884\u3001\u7D20\u51C0\u5B9E\u7528\u3001\u6E29\u67D4\u4E13\u4E1A\u3002", slots("\u8C61\u7259\u767D\u4EA4\u9886\u5185\u886B\uFF0C\u9886\u8FB9\u6574\u6D01", "\u9752\u7EFF\u8272\u77ED\u8884\uFF0C\u4E0A\u8EAB\u5229\u843D\uFF0C\u8896\u53E3\u6536\u7A84", "\u7C73\u7070\u957F\u88D9\uFF0C\u4E0B\u6446\u4E0D\u62D6\u5730\uFF0C\u4FBF\u4E8E\u884C\u52A8", "\u6D45\u7070\u534A\u81C2\u5916\u642D\uFF0C\u68C9\u9EBB\u6750\u8D28\uFF0C\u5C42\u6B21\u6E05\u695A", "\u767D\u8272\u5E03\u889C\uFF0C\u4F4E\u53CD\u5149", "\u7070\u767D\u5E03\u978B\uFF0C\u978B\u5934\u5706\u6DA6", "\u5C0F\u836F\u56CA\u8170\u9970\u3001\u7D20\u94F6\u53D1\u7C2A\u3001\u65E0\u624B\u6301\u836F\u6750"), ["21-28", "29-38", "39-50"]),
  capsule("ancient-male-constable-black-red", "\u53E4\u88C5\u6355\u5FEB\u9ED1\u7EA2\u52B2\u88C5", "male", ["ancient", "period"], ["\u6355\u5FEB", "\u8859\u5F79", "\u53E4\u88C5\u804C\u4E1A", "\u786C\u6C49"], "\u53E4\u4EE3\u6355\u5FEB\u6216\u8859\u5F79\uFF0C\u9ED1\u7EA2\u52B2\u88C5\u3001\u675F\u8896\u3001\u884C\u52A8\u611F\u5F3A\u3002", slots("\u9ED1\u8272\u8D34\u8EAB\u4E2D\u8863\uFF0C\u68C9\u9EBB\u54D1\u5149\uFF0C\u9886\u53E3\u8D34\u5408", "\u6697\u7EA2\u675F\u8896\u77ED\u888D\uFF0C\u80A9\u80CC\u7EBF\u6761\u6E05\u695A", "\u9ED1\u8272\u7A84\u53E3\u957F\u88E4\uFF0C\u4FBF\u4E8E\u5954\u8DD1\uFF0C\u819D\u90E8\u6709\u8936\u76B1", "\u6DF1\u9ED1\u65E0\u8896\u5916\u7F69\uFF0C\u8170\u90E8\u6536\u675F\uFF0C\u8FB9\u7F18\u6697\u7EA2", "\u9ED1\u8272\u7ED1\u817F\uFF0C\u7F20\u7ED5\u5229\u843D", "\u9ED1\u8272\u539A\u5E95\u5E03\u9774\uFF0C\u978B\u9762\u8010\u78E8", "\u76AE\u8D28\u8170\u5E26\u3001\u4EE4\u724C\u6302\u9970\u3001\u65E0\u5200\u5251\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("ancient-male-civil-official-navy", "\u53E4\u88C5\u6587\u5B98\u85CF\u84DD\u5706\u9886\u888D", "male", ["ancient", "period"], ["\u6587\u5B98", "\u671D\u81E3", "\u53E4\u88C5\u804C\u4E1A", "\u6743\u8C0B"], "\u53E4\u4EE3\u6587\u5B98\u6216\u671D\u81E3\uFF0C\u85CF\u84DD\u5706\u9886\u888D\u3001\u514B\u5236\u6743\u8C0B\u611F\u3002", slots("\u7C73\u767D\u4E2D\u8863\uFF0C\u9886\u53E3\u5C42\u6B21\u7A33\u5B9A", "\u85CF\u84DD\u5706\u9886\u888D\u4E0A\u8EAB\uFF0C\u7EC7\u7EB9\u7EC6\u5BC6\uFF0C\u80A9\u7EBF\u7A33", "\u540C\u8272\u957F\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u539A\u91CD\uFF0C\u4E0D\u62D6\u6C93", "\u6DF1\u7070\u5BBD\u8896\u7F69\u888D\uFF0C\u8896\u53E3\u5C42\u6B21\u660E\u663E", "\u9ED1\u8272\u957F\u889C\uFF0C\u9690\u85CF\u4E8E\u888D\u4E0B", "\u9ED1\u8272\u5B98\u9774\uFF0C\u978B\u9762\u54D1\u5149", "\u7389\u8D28\u8170\u4F69\u3001\u6697\u7EB9\u8170\u5E26\u3001\u65E0\u594F\u6298\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("ancient-male-innkeeper-brown", "\u53E4\u88C5\u638C\u67DC\u68D5\u8272\u957F\u886B", "male", ["ancient", "period"], ["\u638C\u67DC", "\u5546\u8D29", "\u5E02\u4E95", "\u53E4\u88C5\u804C\u4E1A"], "\u5BA2\u6808\u638C\u67DC\u6216\u5E97\u8001\u677F\uFF0C\u68D5\u8272\u957F\u886B\u3001\u7B97\u76D8\u611F\u7528\u8170\u9970\u8868\u8FBE\uFF0C\u4E0D\u624B\u6301\u3002", slots("\u6D45\u7070\u4EA4\u9886\u5185\u886B\uFF0C\u68C9\u9EBB\u81EA\u7136\u8936\u76B1", "\u68D5\u8272\u5BF9\u895F\u957F\u886B\u4E0A\u8EAB\uFF0C\u5E03\u6263\u6E05\u695A", "\u6DF1\u8910\u957F\u88E4\uFF0C\u88E4\u811A\u81EA\u7136\u6536\u8FDB\u978B\u9762", "\u6697\u68D5\u77ED\u9A6C\u7532\u5916\u5C42\uFF0C\u53E3\u888B\u8FB9\u7F18\u6E05\u6670", "\u7070\u8272\u5E03\u889C\uFF0C\u4F4E\u8C03", "\u9ED1\u68D5\u5E03\u978B\uFF0C\u978B\u5934\u5706\uFF0C\u78E8\u65E7", "\u8170\u95F4\u5C0F\u94B1\u888B\u3001\u6728\u73E0\u624B\u4E32\u3001\u65E0\u7B97\u76D8\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("ancient-male-merchant-bronze-silk", "\u53E4\u88C5\u5546\u8D3E\u94DC\u68D5\u9526\u888D", "male", ["ancient", "period"], ["\u5546\u8D3E", "\u8001\u677F", "\u8C6A\u95E8", "\u53E4\u88C5\u804C\u4E1A"], "\u53E4\u4EE3\u5BCC\u5546\u6216\u5546\u8D3E\uFF0C\u94DC\u68D5\u9526\u888D\u3001\u539A\u5B9E\u8D35\u6C14\u3001\u975E\u5B98\u975E\u6B66\u3002", slots("\u7C73\u91D1\u4EA4\u9886\u5185\u886B\uFF0C\u7F0E\u9762\u67D4\u5149", "\u94DC\u68D5\u9526\u7F0E\u957F\u888D\u4E0A\u8EAB\uFF0C\u6697\u7EB9\u7EC6\u5BC6\uFF0C\u9886\u53E3\u7A33\u91CD", "\u6DF1\u68D5\u957F\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u539A\u5B9E", "\u9ED1\u68D5\u77ED\u62AB\u98CE\u5916\u5C42\uFF0C\u8FB9\u7F18\u6709\u6697\u91D1\u6EDA\u8FB9", "\u6DF1\u8272\u957F\u889C\uFF0C\u9690\u85CF\u4E8E\u888D\u4E0B", "\u9ED1\u68D5\u539A\u5E95\u5E03\u9774\uFF0C\u978B\u9762\u5E72\u51C0", "\u7389\u4F69\u3001\u94B1\u888B\u3001\u5BBD\u8170\u5E26\u3001\u65E0\u8D26\u672C\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("ancient-male-foot-soldier-gray", "\u53E4\u88C5\u519B\u5352\u7070\u5E03\u8F7B\u7532", "male", ["ancient", "period"], ["\u519B\u5352", "\u58EB\u5175", "\u53E4\u88C5\u804C\u4E1A", "\u5E95\u5C42"], "\u666E\u901A\u53E4\u4EE3\u519B\u5352\uFF0C\u7070\u5E03\u8F7B\u7532\u3001\u6734\u7D20\u3001\u53EF\u7528\u4E8E\u6218\u573A\u7FA4\u4F17\u89D2\u8272\u3002", slots("\u7070\u767D\u7C97\u5E03\u4E2D\u8863\uFF0C\u6C57\u6E0D\u81EA\u7136\u4F46\u5E72\u51C0", "\u7070\u84DD\u77ED\u888D\u4E0A\u8EAB\uFF0C\u8896\u53E3\u6536\u7D27\uFF0C\u5E03\u6599\u7ED3\u5B9E", "\u6DF1\u7070\u7A84\u53E3\u957F\u88E4\uFF0C\u819D\u90E8\u8936\u76B1\u660E\u663E", "\u65E7\u76AE\u9769\u8F7B\u7532\u5916\u5C42\uFF0C\u62A4\u80A9\u7B80\u5316\uFF0C\u65E0\u5175\u5668", "\u7070\u8272\u7ED1\u817F\uFF0C\u7F20\u7ED5\u8010\u78E8", "\u9ED1\u8272\u5E03\u9774\uFF0C\u978B\u5E95\u539A\uFF0C\u4FBF\u4E8E\u5954\u8DD1", "\u76AE\u5E26\u3001\u62A4\u8155\u3001\u65E0\u5200\u67AA\u5F13\u7BAD"), ["21-28", "29-38", "39-50"]),
  capsule("ancient-female-palace-maid-green", "\u53E4\u88C5\u5BAB\u5973\u6D45\u7EFF\u8966\u88D9", "female", ["ancient", "period"], ["\u5BAB\u5973", "\u4F8D\u5973", "\u53E4\u88C5\u804C\u4E1A", "\u5BAB\u5EF7"], "\u5BAB\u5973\u6216\u8D34\u8EAB\u4F8D\u5973\uFF0C\u6D45\u7EFF\u8966\u88D9\u3001\u6E05\u6D01\u3001\u987A\u4ECE\u4F46\u6709\u8FA8\u8BC6\u5EA6\u3002", slots("\u767D\u8272\u62B9\u80F8\u5185\u5C42\uFF0C\u9886\u53E3\u5B89\u5168\uFF0C\u5E03\u9762\u67D4\u5149", "\u6D45\u7EFF\u77ED\u8966\u4E0A\u8EAB\uFF0C\u4EA4\u9886\u5E72\u51C0\uFF0C\u8896\u53E3\u5BBD\u800C\u8F7B", "\u7C73\u767D\u9AD8\u8170\u957F\u88D9\uFF0C\u4E0B\u6446\u5782\u987A\uFF0C\u8936\u7EBF\u7EC6\u5BC6", "\u6D45\u9752\u62AB\u5E1B\u5916\u5C42\uFF0C\u7ED5\u80A9\u4E0D\u906E\u8138", "\u767D\u8272\u5E03\u889C\uFF0C\u4F4E\u53CD\u5149", "\u6D45\u8272\u7EE3\u978B\uFF0C\u978B\u5934\u5C0F\u5DE7", "\u7D20\u94F6\u53D1\u7C2A\u3001\u7EC6\u8170\u5E26\u3001\u65E0\u6258\u76D8\u624B\u6301"), ["16-20", "21-28", "29-38"]),
  capsule("ancient-female-farmer-hemp", "\u53E4\u88C5\u519C\u5987\u9EBB\u5E03\u77ED\u8884", "female", ["ancient", "period", "rural"], ["\u519C\u5987", "\u5E02\u4E95", "\u5E95\u5C42", "\u53E4\u88C5\u804C\u4E1A"], "\u53E4\u4EE3\u519C\u5987\u6216\u6751\u5987\uFF0C\u9EBB\u5E03\u77ED\u8884\u3001\u7C97\u5E03\u957F\u88D9\uFF0C\u6734\u5B9E\u771F\u5B9E\u3002", slots("\u7070\u767D\u7C97\u5E03\u5185\u886B\uFF0C\u68C9\u9EBB\u76B1\u8936\u81EA\u7136", "\u571F\u9EC4\u77ED\u8884\uFF0C\u4E0A\u8EAB\u5BBD\u677E\uFF0C\u8896\u53E3\u5377\u8D77", "\u6DF1\u7070\u957F\u88D9\uFF0C\u88D9\u6446\u8010\u810F\uFF0C\u4E0D\u62D6\u5730", "\u65E7\u84DD\u7C97\u5E03\u6BD4\u7532\u5916\u5C42\uFF0C\u8170\u95F4\u9EBB\u7EF3\u7CFB\u5E26\u660E\u663E", "\u7070\u8272\u5E03\u889C\uFF0C\u4F4E\u8C03", "\u9ED1\u7070\u5E03\u978B\uFF0C\u978B\u9762\u78E8\u65E7", "\u5E03\u5934\u5DFE\u3001\u9EBB\u7EF3\u8170\u5E26\u3001\u65E0\u7BEE\u7B50\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("ancient-male-taoist-gray", "\u53E4\u88C5\u9053\u58EB\u7070\u767D\u9053\u888D", "male", ["ancient", "xianxia", "period"], ["\u9053\u58EB", "\u4FEE\u884C\u8005", "\u53E4\u88C5\u804C\u4E1A", "\u7384\u5B66"], "\u9053\u58EB\u6216\u4FEE\u884C\u8005\uFF0C\u7070\u767D\u9053\u888D\u3001\u7B80\u6D01\u7384\u5B66\u611F\uFF0C\u907F\u514D\u6CD5\u5668\u624B\u6301\u3002", slots("\u767D\u8272\u4EA4\u9886\u4E2D\u8863\uFF0C\u9886\u53E3\u5C42\u6B21\u5E72\u51C0", "\u6D45\u7070\u9053\u888D\u4E0A\u8EAB\uFF0C\u5BBD\u8896\u4F46\u4E0D\u81C3\u80BF\uFF0C\u5E03\u9762\u54D1\u5149", "\u7070\u767D\u957F\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u81EA\u7136\uFF0C\u884C\u8D70\u611F\u5F3A", "\u6DF1\u7070\u5916\u7F69\u957F\u886B\uFF0C\u9886\u8FB9\u9ED1\u8272\u6EDA\u8FB9", "\u767D\u8272\u5E03\u889C\uFF0C\u85CF\u4E8E\u888D\u4E0B", "\u9ED1\u8272\u5E03\u5C65\uFF0C\u978B\u578B\u7B80\u6D01", "\u6728\u7C2A\u3001\u7D20\u8272\u8170\u7EF3\u3001\u65E0\u62C2\u5C18\u65E0\u7B26\u7EB8"), ["29-38", "39-50", "51-65", "66-80"]),
  capsule("ancient-male-monk-ochre", "\u53E4\u88C5\u50E7\u4EBA\u8D6D\u9EC4\u50E7\u888D", "male", ["ancient", "period"], ["\u548C\u5C1A", "\u50E7\u4EBA", "\u53E4\u88C5\u804C\u4E1A", "\u957F\u8F88"], "\u5BFA\u5E99\u50E7\u4EBA\u6216\u9AD8\u50E7\uFF0C\u8D6D\u9EC4\u50E7\u888D\u3001\u5B89\u9759\u5E84\u91CD\u3002", slots("\u7C73\u767D\u50E7\u8863\u5185\u5C42\uFF0C\u68C9\u9EBB\u54D1\u5149", "\u8D6D\u9EC4\u8272\u50E7\u888D\u4E0A\u8EAB\uFF0C\u4EA4\u53E0\u6E05\u695A\uFF0C\u80A9\u90E8\u5E73\u7A33", "\u6DF1\u8910\u5BBD\u677E\u957F\u88E4\uFF0C\u9690\u85CF\u5728\u888D\u4E0B", "\u68D5\u8272\u8888\u88DF\u5F0F\u5916\u5C42\uFF0C\u659C\u62AB\u4F46\u4E0D\u590D\u6742", "\u7070\u8272\u5E03\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u5E03\u978B\uFF0C\u978B\u5934\u5706\u6DA6", "\u6728\u73E0\u624B\u4E32\u3001\u7D20\u7EF3\u8170\u5E26\u3001\u65E0\u7985\u6756\u624B\u6301"), ["39-50", "51-65", "66-80"]),
  capsule("career-female-teacher-cardigan", "\u73B0\u4EE3\u5973\u8001\u5E08\u9488\u7EC7\u5F00\u886B", "female", ["modern", "career", "campus"], ["\u8001\u5E08", "\u73ED\u4E3B\u4EFB", "\u6821\u56ED", "\u804C\u4E1A"], "\u73B0\u4EE3\u5973\u8001\u5E08\u6216\u73ED\u4E3B\u4EFB\uFF0C\u9488\u7EC7\u5F00\u886B\u3001\u957F\u88D9\uFF0C\u4EB2\u548C\u4F46\u6709\u7BA1\u7406\u611F\u3002", slots("\u767D\u8272\u5706\u9886\u5185\u642D\uFF0C\u68C9\u8D28\u67D4\u8F6F\uFF0C\u9886\u53E3\u5E72\u51C0", "\u6D45\u674F\u9488\u7EC7\u5F00\u886B\uFF0C\u4E0A\u8EAB\u5408\u4F53\uFF0C\u7EBD\u6263\u7EC6\u5C0F", "\u6DF1\u7070\u53CA\u819D\u534A\u88D9\uFF0C\u8936\u7EBF\u514B\u5236\uFF0C\u5E03\u6599\u633A\u62EC", "\u7C73\u767D\u8584\u98CE\u8863\u5916\u5C42\uFF0C\u80A9\u7EBF\u67D4\u548C", "\u81EA\u7136\u80A4\u8272\u889C\u6216\u6DF1\u8272\u8FDE\u88E4\u889C\uFF0C\u4F4E\u53CD\u5149", "\u6D45\u68D5\u4F4E\u8DDF\u76AE\u978B\uFF0C\u978B\u578B\u7A33\u91CD", "\u7D20\u8272\u53D1\u5939\u3001\u65E0\u4E66\u672C\u624B\u6301"), ["29-38", "39-50"]),
  capsule("career-male-teacher-knit", "\u73B0\u4EE3\u7537\u8001\u5E08\u886C\u8863\u9488\u7EC7\u80CC\u5FC3", "male", ["modern", "career", "campus"], ["\u8001\u5E08", "\u73ED\u4E3B\u4EFB", "\u6821\u56ED", "\u804C\u4E1A"], "\u73B0\u4EE3\u7537\u8001\u5E08\u6216\u73ED\u4E3B\u4EFB\uFF0C\u886C\u8863\u9488\u7EC7\u80CC\u5FC3\uFF0C\u6E29\u548C\u53EF\u9760\u3002", slots("\u767D\u8272\u68C9\u886C\u8863\uFF0C\u9886\u53E3\u5E73\u6574\uFF0C\u8896\u53E3\u5E72\u51C0", "\u7070\u84DD\u9488\u7EC7\u80CC\u5FC3\uFF0C\u4E0A\u8EAB\u5408\u4F53\uFF0C\u7EB9\u7406\u7EC6\u5BC6", "\u6DF1\u7070\u76F4\u7B52\u897F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136", "\u85CF\u84DD\u8584\u5939\u514B\u5916\u5C42\uFF0C\u77ED\u6B3E\u4E0D\u538B\u8EAB\u9AD8", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u4F4E\u5E2E\u76AE\u978B\uFF0C\u978B\u9762\u54D1\u5149", "\u76AE\u5E26\u3001\u65E0\u6559\u6848\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("career-male-driver-windbreaker", "\u73B0\u4EE3\u53F8\u673A\u6DF1\u8272\u5939\u514B", "male", ["modern", "career"], ["\u53F8\u673A", "\u804C\u4E1A", "\u57CE\u5E02\u5E95\u5C42", "\u7236\u4EB2"], "\u7F51\u7EA6\u8F66\u53F8\u673A\u3001\u4E13\u8F66\u53F8\u673A\u6216\u5BB6\u5EAD\u53F8\u673A\uFF0C\u6DF1\u8272\u5939\u514B\uFF0C\u771F\u5B9E\u751F\u6D3B\u611F\u3002", slots("\u7070\u8272\u5706\u9886T\u6064\uFF0C\u68C9\u8D28\u54D1\u5149", "\u6DF1\u84DD\u62C9\u94FE\u5939\u514B\u4E0A\u8EAB\uFF0C\u8896\u53E3\u6536\u7D27\uFF0C\u80A9\u80CC\u5BBD\u677E", "\u9ED1\u8272\u76F4\u7B52\u4F11\u95F2\u88E4\uFF0C\u88E4\u811A\u81EA\u7136", "\u6DF1\u7070\u8584\u98CE\u8863\u5916\u5C42\uFF0C\u77ED\u6B3E\uFF0C\u4FBF\u4E8E\u884C\u52A8", "\u6DF1\u8272\u889C\u5B50\uFF0C\u9690\u85CF", "\u9ED1\u8272\u8FD0\u52A8\u978B\uFF0C\u978B\u5E95\u539A\uFF0C\u4F4E\u53CD\u5149", "\u65E7\u8155\u8868\u3001\u8F66\u94A5\u5319\u6302\u9970\u3001\u65E0\u624B\u673A\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("career-any-delivery-rider-cyan", "\u73B0\u4EE3\u5916\u5356\u5458\u9752\u8272\u9A91\u624B\u670D", "any", ["modern", "career"], ["\u5916\u5356\u5458", "\u9A91\u624B", "\u57CE\u5E02\u5E95\u5C42", "\u804C\u4E1A"], "\u5916\u5356\u9A91\u624B\u6216\u540C\u57CE\u914D\u9001\u5458\uFF0C\u9752\u8272\u5DE5\u88C5\uFF0C\u804C\u4E1A\u8BC6\u522B\u5F3A\u4F46\u65E0\u54C1\u724C\u6587\u5B57\u3002", slots("\u9ED1\u8272\u901F\u5E72\u5185\u642D\uFF0C\u8D34\u8EAB\u4F46\u4E0D\u7D27\u7EF7", "\u9752\u8272\u9A91\u624B\u5DE5\u88C5\u4E0A\u8863\uFF0C\u53CD\u5149\u6761\u65E0\u6587\u5B57\uFF0C\u62C9\u94FE\u6E05\u6670", "\u9ED1\u8272\u8FD0\u52A8\u957F\u88E4\uFF0C\u819D\u90E8\u6709\u8010\u78E8\u62FC\u63A5", "\u9752\u9ED1\u9632\u98CE\u5916\u5957\uFF0C\u77ED\u6B3E\uFF0C\u80A9\u80CC\u5229\u843D", "\u9ED1\u8272\u62A4\u817F\u7ED3\u6784\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u8FD0\u52A8\u978B\uFF0C\u978B\u5E95\u9632\u6ED1\uFF0C\u884C\u52A8\u611F\u5F3A", "\u5934\u76D4\u6302\u5E26\u3001\u53CD\u5149\u81C2\u7AE0\u3001\u65E0\u54C1\u724C\u65E0\u9910\u7BB1\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("career-male-chef-white-apron", "\u73B0\u4EE3\u53A8\u5E08\u767D\u8272\u53A8\u5E08\u670D", "male", ["modern", "career"], ["\u53A8\u5E08", "\u9910\u996E", "\u804C\u4E1A", "\u57CE\u5E02"], "\u9910\u5385\u53A8\u5E08\u6216\u540E\u53A8\u4E3B\u7BA1\uFF0C\u767D\u8272\u53A8\u5E08\u670D\uFF0C\u5E72\u51C0\u4E13\u4E1A\u3002", slots("\u767D\u8272\u68C9\u8D28\u5185\u886B\uFF0C\u900F\u6C14\u54D1\u5149", "\u767D\u8272\u53CC\u6392\u6263\u53A8\u5E08\u4E0A\u8863\uFF0C\u7EBD\u6263\u6E05\u695A\uFF0C\u8896\u53E3\u5377\u8D77", "\u9ED1\u8272\u76F4\u7B52\u53A8\u5E08\u88E4\uFF0C\u88E4\u811A\u81EA\u7136", "\u65E0\u989D\u5916\u5916\u5C42\uFF0C\u767D\u8272\u53CC\u6392\u6263\u53A8\u5E08\u4E0A\u8863\u5373\u6700\u5916\u5C42\uFF0C\u8170\u7EBF\u5229\u843D", "\u9ED1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u9632\u6ED1\u53A8\u5E08\u978B\uFF0C\u978B\u5934\u5706", "\u53A8\u5E08\u5E3D\u6216\u77ED\u56F4\u5DFE\u3001\u65E0\u5200\u5177\u65E0\u76D8\u5B50\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("career-female-programmer-hoodie", "\u73B0\u4EE3\u5973\u7A0B\u5E8F\u5458\u8FDE\u5E3D\u886B", "female", ["modern", "career"], ["\u7A0B\u5E8F\u5458", "\u79D1\u6280", "\u804C\u4E1A", "\u90FD\u5E02"], "\u5973\u7A0B\u5E8F\u5458\u6216\u79D1\u6280\u516C\u53F8\u5458\u5DE5\uFF0C\u8FDE\u5E3D\u886B\u3001\u5DE5\u724C\u611F\u5F31\u5316\uFF0C\u5E74\u8F7B\u771F\u5B9E\u3002", slots("\u767D\u8272\u57FA\u7840T\u6064\uFF0C\u68C9\u8D28\uFF0C\u9886\u53E3\u5706\u6DA6", "\u96FE\u84DD\u8FDE\u5E3D\u886B\uFF0C\u4E0A\u8EAB\u5BBD\u677E\u4F46\u4E0D\u81C3\u80BF\uFF0C\u5E3D\u7EF3\u65E0\u5B57", "\u9ED1\u8272\u76F4\u7B52\u725B\u4ED4\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136", "\u6D45\u7070\u8F7B\u8584\u5916\u5957\uFF0C\u9632\u98CE\u9762\u6599\uFF0C\u77ED\u6B3E", "\u6DF1\u8272\u77ED\u889C\uFF0C\u4F4E\u53CD\u5149", "\u767D\u7070\u8FD0\u52A8\u978B\uFF0C\u65E0Logo\u6587\u5B57", "\u7B80\u6D01\u8155\u8868\u3001\u65E0\u7535\u8111\u624B\u6301"), ["21-28", "29-38"]),
  capsule("career-male-firefighter-navy", "\u73B0\u4EE3\u6D88\u9632\u5458\u85CF\u84DD\u4F5C\u8BAD\u670D", "male", ["modern", "career"], ["\u6D88\u9632\u5458", "\u6551\u63F4", "\u804C\u4E1A", "\u786C\u6C49"], "\u6D88\u9632\u5458\u6216\u6551\u63F4\u961F\u5458\uFF0C\u85CF\u84DD\u4F5C\u8BAD\u670D\u548C\u53CD\u5149\u6761\uFF0C\u65E0\u5371\u9669\u9053\u5177\u3002", slots("\u9ED1\u8272\u901F\u5E72\u5185\u642D\uFF0C\u8D34\u8EAB\uFF0C\u80A9\u9888\u5E72\u51C0", "\u85CF\u84DD\u4F5C\u8BAD\u4E0A\u8863\uFF0C\u53CD\u5149\u6761\u65E0\u6587\u5B57\uFF0C\u80A9\u80CC\u633A\u62D4", "\u85CF\u84DD\u4F5C\u8BAD\u957F\u88E4\uFF0C\u819D\u90E8\u8010\u78E8\u62FC\u63A5", "\u6A59\u9ED1\u8F7B\u4FBF\u5916\u5957\uFF0C\u9632\u706B\u8D28\u611F\uFF0C\u77ED\u6B3E", "\u9ED1\u8272\u62A4\u817F\u7ED3\u6784\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u6551\u63F4\u9774\uFF0C\u539A\u5E95\uFF0C\u978B\u9762\u5E72\u51C0", "\u62A4\u8155\u3001\u8170\u5E26\u3001\u65E0\u5934\u76D4\u624B\u6301\u65E0\u6D88\u9632\u5668\u6750"), ["21-28", "29-38", "39-50"]),
  capsule("career-male-judge-black-robe", "\u73B0\u4EE3\u7537\u6CD5\u5B98\u9ED1\u8272\u6CD5\u888D", "male", ["modern", "career"], ["\u6CD5\u5B98", "\u6CD5\u5F8B", "\u804C\u4E1A", "\u6743\u5A01"], "\u73B0\u4EE3\u6CD5\u5B98\u6216\u5EAD\u5BA1\u89D2\u8272\uFF0C\u9ED1\u8272\u6CD5\u888D\uFF0C\u6743\u5A01\u3001\u5E84\u91CD\u3001\u65E0\u53EF\u8BFB\u5FBD\u7AE0\u3002", slots("\u767D\u8272\u886C\u8863\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u7EC6\u9886\u5E26\u538B\u4F4F", "\u9ED1\u8272\u6CD5\u888D\u4E0A\u8EAB\uFF0C\u80A9\u7EBF\u5BBD\uFF0C\u80F8\u524D\u88C5\u9970\u65E0\u6587\u5B57", "\u6DF1\u7070\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4", "\u9ED1\u8272\u957F\u888D\u5916\u5C42\uFF0C\u8896\u53E3\u5BBD\u4F46\u8F6E\u5ED3\u6E05\u695A", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u76AE\u978B\uFF0C\u978B\u9762\u54D1\u5149", "\u7D20\u8272\u9886\u5E26\u3001\u65E0\u6CD5\u69CC\u65E0\u6587\u4EF6\u624B\u6301"), ["39-50", "51-65"]),
  capsule("career-female-prosecutor-navy", "\u73B0\u4EE3\u5973\u68C0\u5BDF\u5B98\u85CF\u84DD\u5236\u670D", "female", ["modern", "career"], ["\u68C0\u5BDF\u5B98", "\u6CD5\u5F8B", "\u804C\u4E1A", "\u51B7\u611F"], "\u73B0\u4EE3\u5973\u68C0\u5BDF\u5B98\u6216\u6CD5\u5F8B\u7CFB\u7EDF\u89D2\u8272\uFF0C\u85CF\u84DD\u5236\u670D\uFF0C\u5229\u843D\u514B\u5236\u3002", slots("\u767D\u8272\u886C\u8863\uFF0C\u9886\u53E3\u786C\u633A\uFF0C\u8896\u53E3\u5E72\u51C0", "\u85CF\u84DD\u5236\u670D\u4E0A\u8863\uFF0C\u80A9\u7EBF\u7AEF\u6B63\uFF0C\u7EBD\u6263\u65E0\u6587\u5B57", "\u85CF\u84DD\u53CA\u819D\u534A\u88D9\uFF0C\u5E03\u6599\u633A\u62EC\uFF0C\u540E\u5F00\u8869\u514B\u5236", "\u6DF1\u84DD\u8584\u5916\u5957\uFF0C\u7FFB\u9886\u5E73\u6574\uFF0C\u6536\u8170\u8F7B\u5FAE", "\u81EA\u7136\u80A4\u8272\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u978B\u9762\u5E72\u51C0", "\u7EC6\u8033\u9489\u3001\u7B80\u6D01\u8155\u8868\u3001\u65E0\u6587\u4EF6\u624B\u6301"), ["29-38", "39-50"]),
  capsule("career-male-journalist-field", "\u73B0\u4EE3\u7537\u8BB0\u8005\u6237\u5916\u9A6C\u7532", "male", ["modern", "career"], ["\u8BB0\u8005", "\u5A92\u4F53", "\u804C\u4E1A", "\u57CE\u5E02"], "\u73B0\u573A\u8BB0\u8005\u6216\u8C03\u67E5\u8BB0\u8005\uFF0C\u6237\u5916\u9A6C\u7532\u3001\u886C\u8863\uFF0C\u673A\u52A8\u611F\u5F3A\u4F46\u4E0D\u624B\u6301\u8BBE\u5907\u3002", slots("\u6D45\u7070\u901F\u5E72\u886C\u8863\uFF0C\u8896\u53E3\u53EF\u5377\uFF0C\u9886\u53E3\u5E72\u51C0", "\u5361\u5176\u591A\u888B\u9A6C\u7532\uFF0C\u53E3\u888B\u8FB9\u7F18\u6E05\u695A\uFF0C\u65E0\u53F0\u6807\u6587\u5B57", "\u6DF1\u7070\u6237\u5916\u957F\u88E4\uFF0C\u819D\u90E8\u8010\u78E8", "\u6DF1\u84DD\u9632\u98CE\u5916\u5957\uFF0C\u8F7B\u8584\u77ED\u6B3E", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u53CD\u5149", "\u68D5\u8272\u4F4E\u5E2E\u6237\u5916\u978B\uFF0C\u978B\u5E95\u539A", "\u8BB0\u8005\u8BC1\u611F\u6302\u7EF3\u65E0\u6587\u5B57\u3001\u65E0\u76F8\u673A\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("modern-female-influencer-white-pink", "\u73B0\u4EE3\u5973\u7F51\u7EA2\u767D\u7C89\u65F6\u5C1A\u5957\u88C5", "female", ["modern"], ["\u7F51\u7EA2", "\u76F4\u64AD", "\u90FD\u5E02", "\u5E74\u8F7B"], "\u77ED\u89C6\u9891\u7F51\u7EA2\u6216\u76F4\u64AD\u8FBE\u4EBA\uFF0C\u767D\u7C89\u65F6\u5C1A\u5957\u88C5\uFF0C\u7CBE\u81F4\u4F46\u4E0D\u5938\u5F20\u3002", slots("\u767D\u8272\u4FEE\u8EAB\u5185\u642D\uFF0C\u9488\u7EC7\u67D4\u5149\uFF0C\u9886\u53E3\u5B89\u5168", "\u6D45\u7C89\u77ED\u6B3E\u5916\u5957\uFF0C\u4E0A\u8EAB\u5408\u4F53\uFF0C\u91D1\u5C5E\u6263\u4F4E\u8C03", "\u767D\u8272\u9AD8\u8170\u9614\u817F\u88E4\uFF0C\u5782\u5760\u67D4\u987A\uFF0C\u6BD4\u4F8B\u62C9\u957F", "\u7C73\u767D\u77ED\u62AB\u80A9\u5916\u5C42\uFF0C\u67D4\u8F6F\u4E0D\u906E\u8170\u7EBF", "\u81EA\u7136\u80A4\u8272\u817F\u90E8\u6216\u767D\u8272\u889C\uFF0C\u4F4E\u53CD\u5149", "\u767D\u8272\u539A\u5E95\u978B\uFF0C\u978B\u9762\u65E0Logo", "\u5C0F\u73CD\u73E0\u8033\u9970\u3001\u53D1\u5939\u3001\u65E0\u624B\u673A\u65E0\u9EA6\u514B\u98CE"), ["16-20", "21-28", "29-38"]),
  capsule("career-female-sales-associate-beige", "\u73B0\u4EE3\u5973\u5BFC\u8D2D\u7C73\u8272\u5236\u670D", "female", ["modern", "career"], ["\u5BFC\u8D2D", "\u9500\u552E", "\u670D\u52A1\u4E1A", "\u804C\u4E1A"], "\u5546\u573A\u5BFC\u8D2D\u6216\u9500\u552E\u987E\u95EE\uFF0C\u7C73\u8272\u5236\u670D\u3001\u4EB2\u548C\u3001\u6574\u6D01\u3002", slots("\u767D\u8272\u886C\u8863\uFF0C\u9886\u53E3\u5E73\u6574\uFF0C\u5E03\u6599\u67D4\u5149", "\u7C73\u8272\u4FEE\u8EAB\u9A6C\u7532\uFF0C\u4E0A\u8EAB\u5229\u843D\uFF0C\u7EBD\u6263\u65E0\u54C1\u724C", "\u6DF1\u7070\u53CA\u819D\u534A\u88D9\uFF0C\u8936\u7EBF\u514B\u5236", "\u7C73\u8272\u77ED\u5916\u5957\uFF0C\u7FFB\u9886\u5E72\u51C0\uFF0C\u80A9\u7EBF\u67D4\u548C", "\u81EA\u7136\u80A4\u8272\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u7AD9\u7ACB\u7A33\u5B9A", "\u4E1D\u5DFE\u65E0\u56FE\u6848\u3001\u540D\u724C\u65E0\u6587\u5B57\u3001\u65E0\u8D2D\u7269\u888B\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("career-female-cleaner-blue-apron", "\u73B0\u4EE3\u4FDD\u6D01\u84DD\u8272\u5DE5\u88C5", "female", ["modern", "career"], ["\u4FDD\u6D01", "\u670D\u52A1\u4E1A", "\u57CE\u5E02\u5E95\u5C42", "\u804C\u4E1A"], "\u4FDD\u6D01\u963F\u59E8\u6216\u6E05\u6D01\u5DE5\uFF0C\u84DD\u8272\u5DE5\u4F5C\u670D\uFF0C\u6734\u7D20\u771F\u5B9E\u3002", slots("\u7070\u767D\u68C9\u8D28\u5185\u642D\uFF0C\u5BBD\u677E\u8212\u9002", "\u6D45\u84DD\u5DE5\u4F5C\u670D\u4E0A\u8863\uFF0C\u8896\u53E3\u8010\u78E8\uFF0C\u7EBD\u6263\u7B80\u5355", "\u6DF1\u84DD\u76F4\u7B52\u5DE5\u4F5C\u88E4\uFF0C\u5E03\u6599\u539A\u5B9E", "\u6DF1\u84DD\u8584\u5E03\u5DE5\u4F5C\u9A6C\u7532\uFF0C\u53E3\u888B\u6E05\u695A\uFF0C\u65E0\u54C1\u724C\u6587\u5B57", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u8F6F\u5E95\u5E03\u978B\uFF0C\u65B9\u4FBF\u7AD9\u7ACB", "\u5E03\u5E3D\u3001\u8896\u5957\u3001\u65E0\u62D6\u628A\u6C34\u6876\u624B\u6301"), ["39-50", "51-65", "66-80"]),
  capsule("career-male-security-guard-black", "\u73B0\u4EE3\u4FDD\u5B89\u9ED1\u8272\u5236\u670D", "male", ["modern", "career"], ["\u4FDD\u5B89", "\u5B89\u4FDD", "\u804C\u4E1A", "\u57CE\u5E02\u5E95\u5C42"], "\u5C0F\u533A\u6216\u5546\u573A\u4FDD\u5B89\uFF0C\u9ED1\u8272\u5236\u670D\uFF0C\u666E\u901A\u4F46\u6E05\u695A\u804C\u4E1A\u8EAB\u4EFD\u3002", slots("\u767D\u8272\u77ED\u8896\u886C\u8863\u6216\u9ED1\u8272\u5185\u642D\uFF0C\u9886\u53E3\u5E72\u51C0", "\u9ED1\u8272\u4FDD\u5B89\u5236\u670D\u4E0A\u8863\uFF0C\u80A9\u7AE0\u65E0\u6587\u5B57\uFF0C\u80F8\u888B\u6E05\u695A", "\u9ED1\u8272\u76F4\u7B52\u5236\u670D\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136", "\u9ED1\u8272\u8584\u5939\u514B\u5916\u5C42\uFF0C\u77ED\u6B3E\uFF0C\u62C9\u94FE\u6E05\u695A", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u76AE\u978B\u6216\u4F5C\u8BAD\u978B\uFF0C\u978B\u9762\u8010\u78E8", "\u76AE\u5E26\u3001\u5BF9\u8BB2\u673A\u6302\u9970\u3001\u65E0\u8B66\u68CD\u624B\u6301"), ["21-28", "29-38", "39-50", "51-65"]),
  capsule("campus-female-homeroom-suit", "\u6821\u56ED\u5973\u73ED\u4E3B\u4EFB\u6DF1\u84DD\u5957\u88C5", "female", ["modern", "career", "campus"], ["\u73ED\u4E3B\u4EFB", "\u8001\u5E08", "\u6821\u56ED", "\u957F\u8F88"], "\u4E25\u5389\u5973\u73ED\u4E3B\u4EFB\uFF0C\u6DF1\u84DD\u5957\u88C5\u3001\u773C\u955C\uFF0C\u9002\u5408\u6821\u56ED\u51B2\u7A81\u620F\u3002", slots("\u767D\u8272\u886C\u8863\uFF0C\u9886\u53E3\u786C\u633A\uFF0C\u8896\u53E3\u6574\u6D01", "\u6DF1\u84DD\u77ED\u6B3E\u897F\u88C5\u4E0A\u8863\uFF0C\u80A9\u7EBF\u7AEF\u6B63\uFF0C\u6536\u8170\u8F7B\u5FAE", "\u6DF1\u84DD\u53CA\u819D\u76F4\u7B52\u88D9\uFF0C\u5E03\u6599\u633A\u62EC", "\u7070\u84DD\u8584\u98CE\u8863\u5916\u5C42\uFF0C\u957F\u5230\u819D\u4E0A", "\u9ED1\u8272\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u7AD9\u59FF\u7A33\u5B9A", "\u7D20\u8272\u80F8\u9488\u3001\u65E0\u6559\u97AD\u624B\u6301"), ["29-38", "39-50"]),
  capsule("campus-male-bully-varsity", "\u6821\u56ED\u7537\u6821\u9738\u68D2\u7403\u5939\u514B", "male", ["modern", "campus"], ["\u6821\u9738", "\u5B66\u751F", "\u6821\u56ED", "\u7537\u53CD"], "\u6821\u56ED\u6821\u9738\u6216\u95EE\u9898\u5B66\u751F\uFF0C\u68D2\u7403\u5939\u514B\u3001\u5BBD\u677E\u88E4\uFF0C\u5E74\u8F7B\u5F20\u626C\u3002", slots("\u767D\u8272\u5BBD\u677ET\u6064\uFF0C\u68C9\u8D28\uFF0C\u9886\u53E3\u81EA\u7136", "\u9ED1\u7EA2\u68D2\u7403\u5939\u514B\uFF0C\u4E0A\u8EAB\u5BBD\u677E\uFF0C\u8896\u53E3\u6536\u7D27", "\u6DF1\u84DD\u5BBD\u677E\u725B\u4ED4\u88E4\uFF0C\u88E4\u811A\u5806\u53E0\u81EA\u7136", "\u9ED1\u8272\u8FDE\u5E3D\u5916\u5957\u5185\u53E0\uFF0C\u5E3D\u5B50\u843D\u5728\u80CC\u540E", "\u767D\u8272\u8FD0\u52A8\u889C\uFF0C\u9732\u51FA\u5C11\u91CF", "\u9ED1\u767D\u8FD0\u52A8\u978B\uFF0C\u539A\u5E95\uFF0C\u65E0Logo", "\u8033\u9489\u3001\u8155\u5E26\u3001\u65E0\u7403\u68D2\u65E0\u70DF"), ["16-20", "21-28"]),
  capsule("campus-male-athlete-track", "\u6821\u56ED\u4F53\u80B2\u751F\u8FD0\u52A8\u6821\u670D", "male", ["modern", "campus"], ["\u4F53\u80B2\u751F", "\u5B66\u751F", "\u8FD0\u52A8", "\u6821\u56ED"], "\u4F53\u80B2\u751F\u6216\u6821\u961F\u7537\u751F\uFF0C\u8FD0\u52A8\u6821\u670D\u3001\u5E72\u51C0\u9633\u5149\u3002", slots("\u767D\u8272\u901F\u5E72T\u6064\uFF0C\u8D34\u5408\u80A9\u80CC\uFF0C\u9886\u53E3\u6E05\u723D", "\u84DD\u767D\u8FD0\u52A8\u4E0A\u8863\uFF0C\u62C9\u94FE\u534A\u5F00\uFF0C\u8896\u53E3\u6536\u7D27", "\u9ED1\u8272\u8FD0\u52A8\u957F\u88E4\uFF0C\u88E4\u7EBF\u5229\u843D\uFF0C\u819D\u90E8\u81EA\u7136", "\u84DD\u8272\u9632\u98CE\u6821\u961F\u5916\u5957\uFF0C\u77ED\u6B3E", "\u767D\u8272\u8FD0\u52A8\u889C\uFF0C\u5E72\u51C0", "\u767D\u8272\u8DD1\u978B\uFF0C\u978B\u578B\u8F7B\u76C8\uFF0C\u65E0Logo", "\u8FD0\u52A8\u53D1\u5E26\u3001\u62A4\u8155\u3001\u65E0\u7BEE\u7403\u624B\u6301"), ["16-20", "21-28"]),
  capsule("campus-female-art-student-denim", "\u6821\u56ED\u827A\u672F\u751F\u725B\u4ED4\u80CC\u5E26\u88D9", "female", ["modern", "campus"], ["\u827A\u672F\u751F", "\u5B66\u751F", "\u6821\u56ED", "\u767D\u6708\u5149"], "\u827A\u672F\u751F\u6216\u7F8E\u672F\u751F\uFF0C\u725B\u4ED4\u80CC\u5E26\u88D9\u3001\u9488\u7EC7\u5916\u5957\uFF0C\u6587\u827A\u6E05\u723D\u3002", slots("\u7C73\u767D\u5706\u9886\u9488\u7EC7\u5185\u642D\uFF0C\u67D4\u8F6F\u7EC6\u5BC6", "\u6D45\u84DD\u725B\u4ED4\u80CC\u5E26\u88D9\u4E0A\u8EAB\uFF0C\u80A9\u5E26\u6E05\u695A\uFF0C\u80F8\u524D\u65E0\u5B57", "\u6D45\u84DD\u80CC\u5E26\u88D9\u4E0B\u6446\uFF0CA\u5B57\u5ED3\u5F62\uFF0C\u957F\u5EA6\u5B89\u5168", "\u6D45\u7070\u9488\u7EC7\u5F00\u886B\u5916\u5C42\uFF0C\u77ED\u6B3E\uFF0C\u8896\u53E3\u677E\u8F6F", "\u767D\u8272\u77ED\u889C\uFF0C\u5E72\u51C0", "\u68D5\u8272\u739B\u4E3D\u73CD\u978B\uFF0C\u4F4E\u8DDF\uFF0C\u978B\u9762\u67D4\u5149", "\u53D1\u5939\u3001\u5E06\u5E03\u5305\u80A9\u5E26\u3001\u65E0\u753B\u677F\u624B\u6301"), ["16-20", "21-28"]),
  capsule("campus-male-college-student-simple", "\u73B0\u4EE3\u7537\u5927\u5B66\u751F\u536B\u8863\u725B\u4ED4\u88E4", "male", ["modern", "campus"], ["\u5927\u5B66\u751F", "\u5B66\u751F", "\u5E74\u8F7B", "\u6821\u56ED"], "\u666E\u901A\u7537\u5927\u5B66\u751F\uFF0C\u536B\u8863\u725B\u4ED4\u88E4\uFF0C\u751F\u6D3B\u5316\u3001\u4E0D\u6CB9\u817B\u3002", slots("\u767D\u8272T\u6064\u5185\u5C42\uFF0C\u9886\u53E3\u81EA\u7136", "\u7070\u8272\u8FDE\u5E3D\u536B\u8863\uFF0C\u4E0A\u8EAB\u5BBD\u677E\uFF0C\u5E3D\u7EF3\u65E0\u5B57", "\u6DF1\u84DD\u76F4\u7B52\u725B\u4ED4\u88E4\uFF0C\u88E4\u811A\u81EA\u7136", "\u9ED1\u8272\u77ED\u5939\u514B\u5916\u5C42\uFF0C\u9632\u98CE\u6750\u8D28", "\u6DF1\u8272\u77ED\u889C\uFF0C\u4F4E\u53CD\u5149", "\u767D\u7070\u8FD0\u52A8\u978B\uFF0C\u978B\u9762\u5E72\u51C0\u65E0Logo", "\u7B80\u6D01\u8155\u8868\u3001\u53CC\u80A9\u5305\u80A9\u5E26\u3001\u65E0\u624B\u673A\u624B\u6301"), ["16-20", "21-28"]),
  capsule("campus-female-parent-meeting", "\u6821\u56ED\u5B66\u751F\u5BB6\u957F\u901A\u52E4\u88C5", "female", ["modern", "career", "campus"], ["\u5B66\u751F\u5BB6\u957F", "\u6BCD\u4EB2", "\u6821\u56ED", "\u5BB6\u5EAD"], "\u53C2\u52A0\u5BB6\u957F\u4F1A\u7684\u6BCD\u4EB2\u6216\u57CE\u5E02\u5BB6\u957F\uFF0C\u901A\u52E4\u88C5\u3001\u6210\u719F\u514B\u5236\u3002", slots("\u7C73\u767D\u9488\u7EC7\u5185\u642D\uFF0C\u9886\u53E3\u67D4\u548C", "\u6D45\u5496\u4FEE\u8EAB\u4E0A\u8863\uFF0C\u5E03\u9762\u7EC6\u5BC6\uFF0C\u8170\u7EBF\u6E05\u695A", "\u6DF1\u68D5\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u987A\u76F4", "\u7C73\u8272\u957F\u6B3E\u98CE\u8863\u5916\u5C42\uFF0C\u7FFB\u9886\u5E73\u6574", "\u81EA\u7136\u80A4\u8272\u889C\uFF0C\u4F4E\u53CD\u5149", "\u68D5\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u978B\u578B\u7A33", "\u7EC6\u9879\u94FE\u3001\u8155\u8868\u3001\u65E0\u6587\u4EF6\u888B\u624B\u6301"), ["29-38", "39-50"]),
  capsule("home-female-ordinary-mother-apron", "\u73B0\u4EE3\u666E\u901A\u6BCD\u4EB2\u9488\u7EC7\u5C45\u5BB6\u88C5", "female", ["modern", "elder"], ["\u6BCD\u4EB2", "\u5BB6\u5EAD", "\u5C45\u5BB6", "\u666E\u901A\u4EBA"], "\u666E\u901A\u5BB6\u5EAD\u6BCD\u4EB2\uFF0C\u9488\u7EC7\u886B\u5C45\u5BB6\u88C5\uFF0C\u751F\u6D3B\u771F\u5B9E\uFF0C\u9002\u5408\u5BB6\u5EAD\u4F26\u7406\u3002", slots("\u6D45\u7070\u68C9\u8D28\u5185\u642D\uFF0C\u67D4\u8F6F\u5BBD\u677E", "\u7C73\u8272\u9488\u7EC7\u4E0A\u8863\uFF0C\u8896\u53E3\u5FAE\u5377\uFF0C\u80A9\u7EBF\u81EA\u7136", "\u6DF1\u7070\u76F4\u7B52\u5BB6\u5C45\u88E4\uFF0C\u5E03\u6599\u67D4\u8F6F", "\u6D45\u8272\u9488\u7EC7\u5F00\u886B\u5916\u5C42\uFF0C\u67D4\u8F6F\u5BBD\u677E\uFF0C\u65E0\u56FE\u6848", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u8F6F\u5E95\u5BB6\u5C45\u5E03\u978B\uFF0C\u6D45\u8272\u5E72\u51C0", "\u53D1\u5939\u3001\u65E7\u8155\u8868\u3001\u65E0\u9505\u94F2\u624B\u6301"), ["39-50", "51-65"]),
  capsule("home-male-ordinary-father-polo", "\u73B0\u4EE3\u666E\u901A\u7236\u4EB2Polo\u886B", "male", ["modern", "elder"], ["\u7236\u4EB2", "\u5BB6\u5EAD", "\u666E\u901A\u4EBA", "\u957F\u8F88"], "\u666E\u901A\u7236\u4EB2\u6216\u4E2D\u5E74\u4E08\u592B\uFF0CPolo\u886B\u3001\u4F11\u95F2\u88E4\uFF0C\u7A33\u5B9A\u6734\u7D20\u3002", slots("\u767D\u8272\u68C9\u80CC\u5FC3\u5185\u5C42\uFF0C\u4F4E\u8C03\u4E0D\u5916\u9732", "\u6DF1\u84DDPolo\u886B\uFF0C\u4E0A\u8EAB\u5408\u4F53\uFF0C\u9886\u53E3\u81EA\u7136", "\u5361\u5176\u76F4\u7B52\u4F11\u95F2\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136", "\u7070\u8272\u8584\u5939\u514B\u5916\u5C42\uFF0C\u77ED\u6B3E\uFF0C\u80A9\u80CC\u7A0D\u5BBD", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u4F11\u95F2\u76AE\u978B\uFF0C\u978B\u9762\u65E7\u4F46\u5E72\u51C0", "\u65E7\u8155\u8868\u3001\u76AE\u5E26\u3001\u65E0\u70DF\u9152\u624B\u6301"), ["39-50", "51-65"]),
  capsule("elder-female-dominant-motherinlaw", "\u5F3A\u52BF\u5A46\u5A46\u6DF1\u7D2B\u9488\u7EC7\u5957\u88C5", "female", ["modern", "elder"], ["\u5A46\u5A46", "\u957F\u8F88", "\u5BB6\u5EAD\u4F26\u7406", "\u5F3A\u52BF"], "\u5F3A\u52BF\u5A46\u5A46\u6216\u5BB6\u5EAD\u957F\u8F88\uFF0C\u6DF1\u7D2B\u9488\u7EC7\u5957\u88C5\u3001\u538B\u8FEB\u611F\u5F3A\u3002", slots("\u9ED1\u8272\u9AD8\u9886\u5185\u642D\uFF0C\u9488\u7EC7\u7EC6\u5BC6\uFF0C\u9886\u53E3\u6574\u9F50", "\u6DF1\u7D2B\u9488\u7EC7\u4E0A\u8863\uFF0C\u80A9\u7EBF\u786C\u633A\uFF0C\u80F8\u8170\u7EBF\u6E05\u695A", "\u9ED1\u8272\u76F4\u7B52\u957F\u88E4\uFF0C\u5E03\u6599\u539A\u5B9E", "\u6DF1\u7D2B\u77ED\u5916\u5957\uFF0C\u91D1\u5C5E\u6263\u4F4E\u8C03\uFF0C\u7FFB\u9886\u660E\u663E", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u978B\u578B\u7A33\u91CD", "\u7389\u956F\u3001\u91D1\u8272\u8033\u9489\u3001\u65E0\u62D0\u6756\u624B\u6301"), ["51-65", "66-80"]),
  capsule("elder-male-frail-senior-cardigan", "\u75C5\u5F31\u957F\u8F88\u7070\u8272\u5F00\u886B", "male", ["modern", "elder"], ["\u75C5\u5F31\u957F\u8F88", "\u7236\u4EB2", "\u8001\u4EBA", "\u5BB6\u5EAD"], "\u75C5\u5F31\u7236\u4EB2\u6216\u8001\u4EBA\uFF0C\u7070\u8272\u5F00\u886B\u3001\u5BBD\u677E\u957F\u88E4\uFF0C\u865A\u5F31\u4F46\u4E0D\u5938\u5F20\u3002", slots("\u767D\u8272\u68C9\u8D28\u5185\u8863\uFF0C\u9886\u53E3\u67D4\u8F6F", "\u6D45\u7070\u5F00\u886B\u4E0A\u8863\uFF0C\u9488\u7EC7\u677E\u8F6F\uFF0C\u80A9\u7EBF\u4E0B\u5782", "\u6DF1\u7070\u5BBD\u677E\u957F\u88E4\uFF0C\u5E03\u6599\u67D4\u8F6F\uFF0C\u88E4\u811A\u81EA\u7136", "\u7C73\u8272\u8584\u6BEF\u611F\u5916\u642D\uFF0C\u62AB\u80A9\u5F0F\u4F46\u4E0D\u539A\u91CD", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4FDD\u6696\u6750\u8D28", "\u68D5\u8272\u8F6F\u5E95\u5E03\u978B\uFF0C\u4F4E\u53CD\u5149", "\u65E7\u8155\u8868\u3001\u7D20\u8272\u56F4\u5DFE\u3001\u65E0\u62D0\u6756\u624B\u6301"), ["51-65", "66-80", "80+"]),
  capsule("elder-female-wealthy-grandparent-jade", "\u8C6A\u95E8\u957F\u8F88\u58A8\u7EFF\u4E1D\u7ED2\u5957\u88C5", "female", ["modern", "elder"], ["\u8C6A\u95E8\u957F\u8F88", "\u5976\u5976", "\u5BB6\u4E3B", "\u957F\u8F88"], "\u8C6A\u95E8\u5976\u5976\u6216\u5BB6\u65CF\u957F\u8F88\uFF0C\u58A8\u7EFF\u4E1D\u7ED2\u5957\u88C5\uFF0C\u8D35\u6C14\u4F46\u514B\u5236\u3002", slots("\u8C61\u7259\u767D\u771F\u4E1D\u5185\u642D\uFF0C\u9886\u53E3\u67D4\u5149", "\u58A8\u7EFF\u4E1D\u7ED2\u4E0A\u8863\uFF0C\u80A9\u7EBF\u5E73\u7A33\uFF0C\u6263\u4F4D\u7CBE\u81F4", "\u9ED1\u8272\u5782\u5760\u957F\u88D9\uFF0C\u88D9\u6446\u539A\u5B9E", "\u58A8\u7EFF\u62AB\u80A9\u5916\u5C42\uFF0C\u7ED2\u9762\u4F4E\u5149\uFF0C\u8FB9\u7F18\u7EC6\u5BC6", "\u81EA\u7136\u80A4\u8272\u8584\u889C\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u978B\u9762\u67D4\u5149", "\u7FE1\u7FE0\u8033\u5760\u3001\u7389\u956F\u3001\u65E0\u624B\u5305\u624B\u6301"), ["66-80", "80+"]),
  capsule("rural-elder-plain-villager-gray", "\u519C\u6751\u8001\u4EBA\u7070\u5E03\u68C9\u8884", "any", ["rural", "elder"], ["\u519C\u6751\u8001\u4EBA", "\u957F\u8F88", "\u4E61\u6751", "\u666E\u901A\u4EBA"], "\u519C\u6751\u7237\u7237\u5976\u5976\u7C7B\u666E\u901A\u8001\u4EBA\uFF0C\u7070\u5E03\u68C9\u8884\u3001\u65E7\u5E03\u978B\uFF0C\u771F\u5B9E\u6734\u7D20\u3002", slots("\u6D45\u7070\u68C9\u5E03\u5185\u886B\uFF0C\u5BBD\u677E\u4FDD\u6696", "\u6DF1\u7070\u68C9\u8884\u4E0A\u8EAB\uFF0C\u76D8\u6263\u6216\u5E03\u6263\uFF0C\u80A9\u80CC\u5706\u6DA6", "\u9ED1\u7070\u5BBD\u677E\u68C9\u88E4\uFF0C\u88E4\u811A\u81EA\u7136\u6536\u7D27", "\u6DF1\u84DD\u65E7\u77ED\u5916\u5957\uFF0C\u5E03\u9762\u78E8\u65E7", "\u6DF1\u8272\u539A\u889C\uFF0C\u4FDD\u6696\u4F4E\u8C03", "\u9ED1\u8272\u5E03\u978B\uFF0C\u978B\u9762\u65E7\u4F46\u5E72\u51C0", "\u68C9\u5E3D\u3001\u8896\u5957\u3001\u65E0\u7BEE\u5B50\u62D0\u6756\u624B\u6301"), ["66-80", "80+"]),
  capsule("rural-female-village-doctor-white", "\u4E61\u6751\u5973\u6751\u533B\u767D\u5927\u8902", "female", ["modern", "rural", "career"], ["\u6751\u533B", "\u533B\u751F", "\u4E61\u6751\u804C\u4E1A", "\u5973\u6027"], "\u4E61\u6751\u5973\u6751\u533B\uFF0C\u767D\u5927\u8902\u53E0\u65E5\u5E38\u8863\uFF0C\u4E13\u4E1A\u4F46\u5E26\u4E61\u9547\u751F\u6D3B\u611F\u3002", slots("\u6D45\u84DD\u68C9\u886C\u8863\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u5E03\u9762\u67D4\u8F6F", "\u767D\u8272\u77ED\u5927\u8902\uFF0C\u4E0A\u8EAB\u5408\u4F53\uFF0C\u53E3\u888B\u65E0\u6587\u5B57", "\u6DF1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u4FBF\u4E8E\u884C\u52A8", "\u7C73\u8272\u9488\u7EC7\u5916\u5957\u5185\u53E0\u6216\u62AB\u80A9\uFF0C\u751F\u6D3B\u611F\u5F3A", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u8F6F\u5E95\u5E03\u978B\uFF0C\u5E72\u51C0\u8010\u8D70", "\u5C0F\u836F\u56CA\u8170\u6302\u3001\u53D1\u5939\u3001\u65E0\u542C\u8BCA\u5668\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("rural-male-orchard-boss-vest", "\u679C\u56ED\u8001\u677F\u5DE5\u88C5\u9A6C\u7532", "male", ["modern", "rural"], ["\u679C\u56ED\u8001\u677F", "\u4E61\u6751\u804C\u4E1A", "\u521B\u4E1A", "\u7236\u4EB2"], "\u679C\u56ED\u8001\u677F\u6216\u79CD\u690D\u6237\uFF0C\u5DE5\u88C5\u9A6C\u7532\u3001\u8010\u78E8\u88E4\uFF0C\u52A1\u5B9E\u53EF\u9760\u3002", slots("\u6D45\u7070\u68C9T\u6064\uFF0C\u5438\u6C57\u54D1\u5149", "\u519B\u7EFF\u5DE5\u88C5\u9A6C\u7532\uFF0C\u4E0A\u8EAB\u5BBD\u677E\uFF0C\u53E3\u888B\u65E0\u5B57", "\u6DF1\u7070\u8010\u78E8\u957F\u88E4\uFF0C\u819D\u90E8\u62FC\u63A5\uFF0C\u88E4\u811A\u6536\u675F", "\u5361\u5176\u8584\u5939\u514B\u5916\u5C42\uFF0C\u77ED\u6B3E\uFF0C\u8896\u53E3\u8010\u78E8", "\u6DF1\u8272\u4F4E\u5E2E\u889C\u6750\uFF0C\u4F4E\u8C03", "\u68D5\u8272\u6237\u5916\u978B\uFF0C\u978B\u5E95\u539A\uFF0C\u5E26\u6CE5\u571F\u611F\u4F46\u4E0D\u810F\u4E71", "\u8349\u5E3D\u6302\u7EF3\u3001\u5E03\u8170\u5305\u3001\u65E0\u6C34\u679C\u7B50\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("rural-male-breeder-workwear", "\u517B\u6B96\u6237\u6DF1\u84DD\u5DE5\u88C5", "male", ["modern", "rural"], ["\u517B\u6B96\u6237", "\u4E61\u6751\u804C\u4E1A", "\u5DE5\u4EBA", "\u7236\u4EB2"], "\u517B\u6B96\u6237\u6216\u519C\u573A\u4E3B\uFF0C\u6DF1\u84DD\u5DE5\u88C5\u3001\u80F6\u9774\uFF0C\u52B3\u52A8\u611F\u771F\u5B9E\u3002", slots("\u9ED1\u8272\u901F\u5E72\u5185\u642D\uFF0C\u8D34\u8EAB\u5438\u6C57", "\u6DF1\u84DD\u5DE5\u88C5\u4E0A\u8863\uFF0C\u8896\u53E3\u6536\u7D27\uFF0C\u5E03\u6599\u8010\u78E8", "\u6DF1\u84DD\u9632\u6C34\u5DE5\u4F5C\u88E4\uFF0C\u88E4\u817F\u5BBD\u677E", "\u6A44\u6984\u7EFF\u9632\u6C34\u5916\u5957\uFF0C\u77ED\u6B3E\uFF0C\u8868\u9762\u54D1\u5149", "\u9ED1\u8272\u9632\u6C34\u62A4\u817F\u7ED3\u6784\uFF0C\u9632\u6C34\u611F", "\u9ED1\u8272\u80F6\u9774\uFF0C\u978B\u9762\u5E72\u51C0\uFF0C\u539A\u5E95", "\u624B\u5957\u6302\u9970\u3001\u8170\u5305\u3001\u65E0\u9972\u6599\u6876\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("rural-male-township-secretary-white-shirt", "\u4E61\u9547\u4E66\u8BB0\u767D\u886C\u8863\u5939\u514B", "male", ["modern", "rural", "career"], ["\u4E61\u9547\u4E66\u8BB0", "\u5E72\u90E8", "\u4E61\u6751\u804C\u4E1A", "\u6743\u5A01"], "\u4E61\u9547\u4E66\u8BB0\u6216\u57FA\u5C42\u5E72\u90E8\uFF0C\u767D\u886C\u8863\u5939\u514B\uFF0C\u7A33\u91CD\u63A5\u5730\u6C14\u3002", slots("\u767D\u8272\u77ED\u8896\u886C\u8863\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u8896\u53E3\u6574\u6D01", "\u85CF\u84DD\u8584\u5939\u514B\u4E0A\u8EAB\uFF0C\u62C9\u94FE\u6E05\u695A\uFF0C\u80A9\u7EBF\u7A33", "\u9ED1\u8272\u76F4\u7B52\u897F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136", "\u6DF1\u7070\u4E2D\u957F\u5916\u5957\uFF0C\u7FFB\u9886\u5E73\u6574\uFF0C\u9002\u5408\u4E0B\u4E61", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u76AE\u978B\uFF0C\u978B\u9762\u54D1\u5149", "\u515A\u653F\u611F\u80F8\u9488\u4E0D\u663E\u793A\u6587\u5B57\u3001\u76AE\u5E26\u3001\u65E0\u6587\u4EF6\u624B\u6301"), ["39-50", "51-65"]),
  capsule("rural-female-return-founder-linen", "\u8FD4\u4E61\u521B\u4E1A\u5973\u9752\u5E74\u4E9A\u9EBB\u5957\u88C5", "female", ["modern", "rural"], ["\u8FD4\u4E61\u521B\u4E1A", "\u4E61\u6751\u9752\u5E74", "\u5973\u4E3B", "\u521B\u4E1A"], "\u8FD4\u4E61\u521B\u4E1A\u5973\u9752\u5E74\uFF0C\u4E9A\u9EBB\u886C\u886B\u3001\u5DE5\u88C5\u88E4\uFF0C\u73B0\u4EE3\u4E0E\u4E61\u6751\u878D\u5408\u3002", slots("\u767D\u8272\u68C9\u9EBB\u5185\u642D\uFF0C\u9886\u53E3\u81EA\u7136", "\u6D45\u7C73\u4E9A\u9EBB\u886C\u886B\uFF0C\u4E0A\u8EAB\u5BBD\u677E\uFF0C\u8896\u53E3\u5377\u8D77", "\u6A44\u6984\u7EFF\u9AD8\u8170\u5DE5\u88C5\u88E4\uFF0C\u88E4\u888B\u6E05\u695A\uFF0C\u6BD4\u4F8B\u5229\u843D", "\u6D45\u5361\u5176\u77ED\u5916\u5957\uFF0C\u68C9\u9EBB\u8D28\u611F\uFF0C\u80A9\u7EBF\u67D4\u548C", "\u767D\u8272\u77ED\u889C\uFF0C\u5E72\u51C0", "\u6D45\u68D5\u6237\u5916\u978B\uFF0C\u978B\u5E95\u539A\uFF0C\u9002\u5408\u7530\u95F4", "\u8349\u7F16\u53D1\u5939\u3001\u7EC6\u8155\u8868\u3001\u65E0\u519C\u4EA7\u54C1\u624B\u6301"), ["21-28", "29-38"]),
  capsule("rural-male-construction-foreman-gray", "\u5305\u5DE5\u5934\u7070\u8272\u5DE5\u88C5\u5939\u514B", "male", ["modern", "rural", "career"], ["\u5305\u5DE5\u5934", "\u5DE5\u5730", "\u4E61\u6751\u804C\u4E1A", "\u8001\u677F"], "\u5305\u5DE5\u5934\u6216\u4E61\u9547\u5DE5\u7A0B\u8001\u677F\uFF0C\u7070\u8272\u5DE5\u88C5\u5939\u514B\u3001\u539A\u5E95\u978B\uFF0C\u5F3A\u52BF\u73B0\u5B9E\u3002", slots("\u9ED1\u8272\u5706\u9886T\u6064\uFF0C\u68C9\u8D28\uFF0C\u80A9\u80CC\u7ED3\u5B9E", "\u7070\u8272\u5DE5\u88C5\u5939\u514B\uFF0C\u4E0A\u8EAB\u5BBD\u677E\uFF0C\u53E3\u888B\u591A\u4F46\u65E0\u5B57", "\u6DF1\u84DD\u725B\u4ED4\u88E4\uFF0C\u819D\u90E8\u78E8\u65E7\u81EA\u7136", "\u68D5\u8272\u76AE\u8D28\u77ED\u5916\u5957\uFF0C\u62AB\u80A9\u5F0F\u6216\u62C9\u94FE\u534A\u5F00", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u68D5\u9ED1\u52B3\u4FDD\u978B\uFF0C\u539A\u5E95\uFF0C\u978B\u9762\u8010\u78E8", "\u91D1\u5C5E\u8155\u8868\u3001\u76AE\u5E26\u3001\u65E0\u5B89\u5168\u5E3D\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("period-female-factory-worker-blue", "\u5E74\u4EE3\u5DE5\u5382\u5973\u5DE5\u84DD\u5E03\u5DE5\u88C5", "female", ["period", "modern", "career"], ["\u5DE5\u5382\u5973\u5DE5", "\u5E74\u4EE3", "\u5DE5\u4EBA", "\u5973\u6027"], "\u5E74\u4EE3\u611F\u5DE5\u5382\u5973\u5DE5\uFF0C\u84DD\u5E03\u5DE5\u88C5\u3001\u6734\u7D20\u3001\u9002\u5408\u516B\u4E5D\u5341\u5E74\u4EE3\u620F\u3002", slots("\u767D\u8272\u68C9\u5E03\u5185\u886B\uFF0C\u9886\u53E3\u7B80\u5355", "\u84DD\u8272\u5DE5\u88C5\u4E0A\u8863\uFF0C\u5E03\u6263\u6E05\u695A\uFF0C\u8896\u53E3\u8010\u78E8", "\u6DF1\u84DD\u76F4\u7B52\u5DE5\u88C5\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u5E03\u9762\u539A\u5B9E", "\u6D45\u7070\u77ED\u7F69\u886B\u5916\u5C42\uFF0C\u52B3\u52A8\u611F\u771F\u5B9E", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u5E03\u978B\uFF0C\u978B\u9762\u78E8\u65E7", "\u5E03\u5E3D\u3001\u8896\u5957\u3001\u65E0\u5DE5\u5177\u624B\u6301"), ["21-28", "29-38", "39-50"]),
  capsule("period-male-factory-teamlead-navy", "\u5E74\u4EE3\u5DE5\u5382\u73ED\u957F\u85CF\u84DD\u5DE5\u88C5", "male", ["period", "modern", "career"], ["\u5DE5\u5382\u73ED\u957F", "\u5E74\u4EE3", "\u5DE5\u4EBA", "\u7BA1\u7406"], "\u5E74\u4EE3\u5DE5\u5382\u73ED\u957F\u6216\u8F66\u95F4\u4E3B\u7BA1\uFF0C\u85CF\u84DD\u5DE5\u88C5\u3001\u6734\u5B9E\u6743\u5A01\u3002", slots("\u7070\u767D\u68C9\u80CC\u5FC3\u6216\u5185\u886B\uFF0C\u9886\u53E3\u4F4E\u8C03", "\u85CF\u84DD\u5DE5\u88C5\u4E0A\u8863\uFF0C\u80F8\u888B\u65E0\u6587\u5B57\uFF0C\u80A9\u7EBF\u7A33", "\u85CF\u84DD\u76F4\u7B52\u5DE5\u88C5\u88E4\uFF0C\u819D\u90E8\u81EA\u7136\u8936\u76B1", "\u6DF1\u7070\u5DE5\u4F5C\u5939\u514B\u5916\u5C42\uFF0C\u77ED\u6B3E\u8010\u78E8", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u53CD\u5149", "\u9ED1\u8272\u52B3\u4FDD\u978B\uFF0C\u978B\u5E95\u539A", "\u65E7\u8155\u8868\u3001\u5E03\u8170\u5E26\u3001\u65E0\u6273\u624B\u624B\u6301"), ["29-38", "39-50", "51-65"]),
  capsule("rural-female-grocery-owner-floral", "\u4E61\u6751\u5C0F\u5356\u90E8\u8001\u677F\u5A18\u82B1\u886C\u886B", "female", ["modern", "rural"], ["\u5C0F\u5356\u90E8\u8001\u677F\u5A18", "\u4E61\u6751\u804C\u4E1A", "\u6BCD\u4EB2", "\u5E02\u4E95"], "\u4E61\u6751\u5C0F\u5356\u90E8\u8001\u677F\u5A18\u6216\u6751\u53E3\u5546\u8D29\uFF0C\u82B1\u886C\u886B\u914D\u6DF1\u8272\u957F\u88E4\uFF0C\u5E02\u4E95\u611F\u5F3A\u3002", slots("\u767D\u8272\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u5B89\u5168", "\u6D45\u82B1\u8272\u77ED\u8896\u886C\u886B\uFF0C\u4E0A\u8EAB\u5BBD\u677E\uFF0C\u56FE\u6848\u4E0D\u5E26\u6587\u5B57", "\u9ED1\u8272\u76F4\u7B52\u957F\u88E4\uFF0C\u5E03\u9762\u8010\u78E8", "\u6DF1\u84DD\u8584\u5E03\u9A6C\u7532\u5916\u5C42\uFF0C\u53E3\u888B\u6E05\u695A", "\u6DF1\u8272\u889C\u5B50\uFF0C\u4F4E\u8C03", "\u9ED1\u8272\u8F6F\u5E95\u5E03\u978B\uFF0C\u7AD9\u7ACB\u7A33\u5B9A", "\u53D1\u5939\u3001\u8896\u5957\u3001\u65E0\u5546\u54C1\u624B\u6301"), ["39-50", "51-65"]),
  capsule("rural-male-tractor-driver-denim", "\u4E61\u6751\u62D6\u62C9\u673A\u624B\u725B\u4ED4\u5DE5\u88C5", "male", ["modern", "rural"], ["\u62D6\u62C9\u673A\u624B", "\u519C\u673A\u624B", "\u4E61\u6751\u804C\u4E1A", "\u786C\u6C49"], "\u62D6\u62C9\u673A\u624B\u6216\u519C\u673A\u624B\uFF0C\u725B\u4ED4\u5DE5\u88C5\u3001\u5E3D\u5B50\uFF0C\u52B3\u52A8\u611F\u548C\u7C97\u7C9D\u611F\u3002", slots("\u7070\u8272\u6C57\u886B\uFF0C\u68C9\u8D28\uFF0C\u80A9\u80CC\u7ED3\u5B9E", "\u6DF1\u84DD\u725B\u4ED4\u5DE5\u88C5\u4E0A\u8863\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u5E03\u9762\u78E8\u65E7", "\u9ED1\u7070\u8010\u78E8\u957F\u88E4\uFF0C\u88E4\u811A\u6536\u7D27", "\u519B\u7EFF\u77ED\u5939\u514B\u5916\u5C42\uFF0C\u9632\u98CE\u8010\u810F", "\u6DF1\u8272\u62A4\u817F\u5E03\u5E26\uFF0C\u4F4E\u8C03", "\u68D5\u9ED1\u52B3\u4FDD\u978B\uFF0C\u539A\u5E95\uFF0C\u884C\u52A8\u611F\u5F3A", "\u65E7\u5E03\u5E3D\u3001\u624B\u5957\u6302\u9970\u3001\u65E0\u5DE5\u5177\u624B\u6301"), ["21-28", "29-38", "39-50", "51-65"])
];

// services/characterStylingWardrobeCapsulesSupplement.ts
var slot2 = (detail, material = detail) => ({
  label: detail.slice(0, 18),
  material,
  detail
});
var slots2 = (inner, top, bottom, outerwear, legwear, shoes, accessory) => ({
  inner: slot2(inner),
  top: slot2(top),
  bottom: slot2(bottom),
  outerwear: slot2(outerwear),
  legwear: slot2(legwear),
  shoes: slot2(shoes),
  accessory: slot2(accessory)
});
var capsule2 = (id, label, gender, eras, roleTags, summary, capsuleSlots, ageBands) => ({
  id,
  label,
  gender,
  eras,
  roleTags,
  summary,
  ageBands,
  slots: capsuleSlots
});
var SUPPLEMENTAL_WARDROBE_CAPSULES = [
  capsule2("modern-male-light-business-blazer", "\u73B0\u4EE3\u7537\u6027\u6D45\u5546\u52A1\u897F\u88C5\u7EC4\u5408", "male", ["modern", "career"], ["\u7537\u4E3B", "\u804C\u4E1A", "\u5F8B\u5E08", "\u8001\u5E08", "\u4E0A\u73ED\u65CF"], "\u73B0\u4EE3\u7537\u6027\u975E\u9ED1\u897F\u88C5\u65B9\u5411\uFF0C\u8F7B\u5546\u52A1\u3001\u5E72\u51C0\u3001\u4E13\u4E1A\uFF0C\u9002\u5408\u8001\u5E08\u3001\u5F8B\u5E08\u3001\u666E\u901A\u804C\u573A\u7537\u4E3B\u3002", slots2(
    "\u5185\u642D\uFF1A\u9AD8\u652F\u68C9\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u8896\u53E3\u5E72\u51C0\uFF0C\u8D34\u5408\u4F46\u4E0D\u7D27\u7EF7",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u8F7B\u5546\u52A1\u5355\u6392\u6263\u897F\u88C5\u4E0A\u5C42\uFF0C\u80A9\u7EBF\u81EA\u7136\uFF0C\u8170\u8EAB\u5229\u843D",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u4FEE\u8EAB\u76F4\u7B52\u897F\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A\uFF0C\u6BD4\u4F8B\u5E72\u51C0",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u8F7B\u57AB\u80A9\u897F\u88C5\u5916\u5957\uFF0C\u7FFB\u9886\u6E05\u695A\uFF0C\u5E03\u6599\u54D1\u5149\uFF0C\u975E\u539A\u91CD\u793C\u670D\u611F",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u7EC6\u9488\u7EC7\u6B63\u88C5\u889C\u6750\uFF0C\u53EA\u5728\u88E4\u811A\u5904\u5C11\u91CF\u9732\u51FA",
    "\u978B\u5C65\uFF1A\u4E50\u798F\u978B\u6216\u6263\u5E26\u76AE\u978B\uFF0C\u978B\u578B\u4FEE\u957F\uFF0C\u4F4E\u53CD\u5149",
    "\u88C5\u9970\uFF1A\u8155\u8868\u3001\u5C0F\u9762\u79EF\u7EC6\u8282\u3001\u4E0D\u624B\u6301\u6587\u4EF6"
  ), ["21-28", "29-38", "39-50"]),
  capsule2("modern-male-knit-cardigan-office", "\u73B0\u4EE3\u7537\u6027\u9488\u7EC7\u5F00\u886B\u529E\u516C\u88C5", "male", ["modern", "career"], ["\u533B\u751F", "\u8001\u5E08", "\u6696\u7537", "\u666E\u901A\u4EBA", "\u5BB6\u5EAD"], "\u73B0\u4EE3\u7537\u6027\u6E29\u548C\u804C\u4E1A\u65B9\u5411\uFF0C\u9488\u7EC7\u5F00\u886B\u3001\u886C\u886B\u3001\u76F4\u7B52\u88E4\uFF0C\u907F\u514D\u6240\u6709\u7537\u6027\u90FD\u843D\u5230\u9ED1\u897F\u88C5\u3002", slots2(
    "\u5185\u642D\uFF1A\u67D4\u8F6F\u68C9\u8D28\u886C\u886B\u6216\u5706\u9886\u5185\u642D\uFF0C\u9886\u53E3\u81EA\u7136\uFF0C\u6750\u8D28\u4F4E\u53CD\u5149",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u7EC6\u9488\u7EC7\u5F00\u886B\uFF0C\u95E8\u895F\u548C\u8896\u53E3\u7EB9\u7406\u6E05\u695A\uFF0C\u80A9\u7EBF\u67D4\u548C",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u76F4\u7B52\u4F11\u95F2\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u751F\u6D3B\u5316\u4F46\u4E0D\u677E\u57AE",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u77ED\u6B3E\u901A\u52E4\u5916\u5957\u6216\u5F00\u886B\u5916\u5C42\uFF0C\u8F6E\u5ED3\u6E29\u548C\uFF0C\u9002\u5408\u5BA4\u5185\u529E\u516C",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u4F4E\u8C03\u889C\u6750\uFF0C\u88E4\u811A\u4E0B\u53EA\u9732\u51FA\u5C11\u91CF",
    "\u978B\u5C65\uFF1A\u8F6F\u5E95\u76AE\u978B\u6216\u901A\u52E4\u4F11\u95F2\u978B\uFF0C\u5E72\u51C0\u8010\u770B",
    "\u8155\u8868\u6216\u80F8\u524D\u5C0F\u7B14\u5939\u7ED3\u6784\u3001\u4E0D\u51FA\u73B0\u53EF\u8BFB\u6587\u5B57"
  ), ["21-28", "29-38", "39-50"]),
  capsule2("modern-male-rich-heir-casual-knit", "\u73B0\u4EE3\u8D35\u516C\u5B50\u4F11\u95F2\u9488\u7EC7\u88C5", "male", ["modern", "career"], ["\u8D35\u516C\u5B50", "\u7EE7\u627F\u4EBA", "\u540D\u6D41", "\u8C6A\u95E8", "\u7537\u53CD"], "\u8C6A\u95E8\u5E74\u8F7B\u7537\u6027\u7684\u975E\u897F\u88C5\u65B9\u5411\uFF0C\u9488\u7EC7\u3001\u5BBD\u677E\u886C\u886B\u3001\u4F11\u95F2\u957F\u88E4\uFF0C\u8D35\u6C14\u4F46\u4E0D\u9760\u5355\u4E00\u5957\u88C5\u3002", slots2(
    "\u5185\u642D\uFF1A\u7EC6\u9488\u7EC7\u5185\u642D\uFF0C\u8D34\u5408\u80A9\u9888\uFF0C\u9886\u53E3\u5B89\u5168\uFF0C\u8D28\u611F\u67D4\u548C",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u5BBD\u677E\u886C\u886B\u6216\u8F7B\u8584\u9488\u7EC7\u4E0A\u5C42\uFF0C\u8896\u53E3\u7565\u677E\uFF0C\u8F6E\u5ED3\u677E\u5F1B",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u5782\u5760\u4F11\u95F2\u957F\u88E4\uFF0C\u8170\u7EBF\u6E05\u695A\uFF0C\u817F\u90E8\u6BD4\u4F8B\u62C9\u957F",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u77ED\u6B3E\u7F8A\u6BDB\u5F00\u886B\u6216\u8F7B\u5939\u514B\uFF0C\u80A9\u7EBF\u677E\u5F1B\u4F46\u9AD8\u7EA7",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u7EC6\u889C\u6750\u4E0E\u4F11\u95F2\u978B\u81EA\u7136\u8854\u63A5",
    "\u978B\u5C65\uFF1A\u4E50\u798F\u978B\u3001\u77ED\u9774\u6216\u5E72\u51C0\u4F11\u95F2\u978B\uFF0C\u978B\u9762\u4F4E\u53CD\u5149",
    "\u88C5\u9970\uFF1A\u6212\u6307\u3001\u7A84\u9879\u94FE\u3001\u8155\u8868\u6216\u8896\u53E3\u7EC6\u8282\uFF0C\u8D35\u4F46\u4E0D\u62A2\u8138"
  ), ["21-28", "29-38"]),
  capsule2("modern-male-media-reporter-field", "\u73B0\u4EE3\u7537\u8BB0\u8005\u5916\u52E4\u5939\u514B\u88C5", "male", ["modern", "career"], ["\u8BB0\u8005", "\u5A92\u4F53", "\u8C03\u67E5", "\u666E\u901A\u804C\u4E1A"], "\u73B0\u4EE3\u8BB0\u8005\u548C\u5A92\u4F53\u5916\u52E4\u89D2\u8272\uFF0C\u5939\u514B\u3001\u886C\u886B\u3001\u8010\u8D70\u978B\uFF0C\u9002\u5408\u5267\u60C5\u8C03\u67E5\u548C\u91C7\u8BBF\u573A\u666F\u3002", slots2(
    "\u5185\u642D\uFF1A\u68C9\u8D28T\u6064\u6216\u886C\u886B\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u65B9\u4FBF\u884C\u52A8",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u591A\u53E3\u888B\u5916\u52E4\u886C\u886B\uFF0C\u80A9\u80CC\u6D3B\u52A8\u7A7A\u95F4\u8DB3\uFF0C\u80F8\u524D\u65E0\u6587\u5B57",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u76F4\u7B52\u8010\u78E8\u957F\u88E4\uFF0C\u819D\u90E8\u6709\u81EA\u7136\u8936\u76B1",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u77ED\u6B3E\u5916\u52E4\u5939\u514B\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u62C9\u94FE\u548C\u80A9\u7EBF\u5229\u843D",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u8010\u8D70\u889C\u6750\uFF0C\u9732\u51FA\u9762\u79EF\u5C0F",
    "\u978B\u5C65\uFF1A\u4F4E\u5E2E\u8010\u8D70\u978B\u6216\u5DE5\u88C5\u77ED\u9774\uFF0C\u978B\u5E95\u7A33",
    "\u8155\u8868\u3001\u76F8\u673A\u80CC\u5E26\u611F\u80A9\u5E26\u7ED3\u6784\u3001\u4F46\u4E0D\u624B\u6301\u76F8\u673A"
  ), ["21-28", "29-38", "39-50"]),
  capsule2("modern-male-family-father-casual", "\u73B0\u4EE3\u5BB6\u5EAD\u7537\u6027\u901A\u52E4\u4F11\u95F2\u88C5", "male", ["modern", "elder"], ["\u7236\u4EB2", "\u53D4\u4F2F", "\u4EB2\u621A", "\u5BB6\u5EAD", "\u666E\u901A\u4EBA"], "\u5BB6\u5EAD\u4F26\u7406\u5267\u5E38\u89C1\u7537\u6027\uFF0C\u4E0D\u7528\u9ED1\u897F\u88C5\uFF0C\u7528Polo\u3001\u5939\u514B\u3001\u4F11\u95F2\u88E4\u62C9\u5F00\u5E74\u9F84\u548C\u751F\u6D3B\u611F\u3002", slots2(
    "\u5185\u642D\uFF1A\u68C9\u8D28\u80CC\u5FC3\u6216\u5706\u9886\u5185\u642D\uFF0C\u4F4E\u8C03\u4E0D\u5916\u9732\u8FC7\u591A",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1APolo\u886B\u6216\u4F11\u95F2\u886C\u886B\uFF0C\u9886\u53E3\u81EA\u7136\uFF0C\u80A9\u80CC\u7565\u5BBD",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u76F4\u7B52\u4F11\u95F2\u957F\u88E4\uFF0C\u8170\u90E8\u6709\u76AE\u5E26\u7ED3\u6784\uFF0C\u88E4\u7EBF\u81EA\u7136",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u8584\u5939\u514B\u6216\u901A\u52E4\u77ED\u5916\u5957\uFF0C\u80A9\u80CC\u6709\u751F\u6D3B\u8936\u76B1",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u65E5\u5E38\u889C\u6750\uFF0C\u9690\u85CF\u5728\u88E4\u811A\u548C\u978B\u53E3\u4E4B\u95F4",
    "\u978B\u5C65\uFF1A\u5B9E\u7528\u76AE\u978B\u6216\u4F11\u95F2\u978B\uFF0C\u9002\u5408\u8D70\u8DEF\u548C\u5BB6\u5EAD\u573A\u666F",
    "\u88C5\u9970\uFF1A\u65E7\u8155\u8868\u3001\u76AE\u5E26\u3001\u5C0F\u94A5\u5319\u6263\u7ED3\u6784\uFF0C\u4E0D\u624B\u6301\u70DF\u9152"
  ), ["39-50", "51-65"]),
  capsule2("modern-male-driver-practical-jacket", "\u73B0\u4EE3\u7537\u53F8\u673A\u5B9E\u7528\u5939\u514B\u88C5", "male", ["modern", "rural"], ["\u53F8\u673A", "\u666E\u901A\u4EBA", "\u4FDD\u9556", "\u5DE5\u4EBA"], "\u53F8\u673A\u3001\u4FDD\u9556\u3001\u666E\u901A\u7537\u6027\u804C\u4E1A\u65B9\u5411\uFF0C\u5B9E\u7528\u5939\u514B\u548C\u8010\u78E8\u88E4\uFF0C\u4E0D\u8D70\u603B\u88C1\u9ED1\u897F\u88C5\u3002", slots2(
    "\u5185\u642D\uFF1A\u8D34\u8EABT\u6064\u6216\u8584\u886C\u886B\uFF0C\u80A9\u9888\u6D3B\u52A8\u65B9\u4FBF",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u62C9\u94FE\u5939\u514B\u5185\u5C42\u6216\u5DE5\u88C5\u886C\u886B\uFF0C\u8896\u53E3\u5229\u843D",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u8010\u78E8\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u811A\u6536\u5F97\u5E72\u51C0",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u5B9E\u7528\u77ED\u5939\u514B\uFF0C\u62C9\u94FE\u3001\u53E3\u888B\u548C\u80A9\u7EBF\u6E05\u695A",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u539A\u889C\u6750\uFF0C\u9690\u85CF\u5728\u978B\u53E3\u5185",
    "\u978B\u5C65\uFF1A\u8010\u78E8\u5B9E\u7528\u76AE\u978B\u6216\u77ED\u9774\uFF0C\u978B\u5E95\u539A\u5EA6\u9002\u4E2D",
    "\u88C5\u9970\uFF1A\u8170\u5E26\u3001\u8155\u8868\u3001\u94A5\u5319\u6263\u7ED3\u6784\uFF0C\u4E0D\u624B\u6301\u8F66\u94A5\u5319"
  ), ["29-38", "39-50", "51-65"]),
  capsule2("modern-male-caregiver-soft-uniform", "\u73B0\u4EE3\u7537\u62A4\u5DE5\u8F6F\u5236\u670D\u88C5", "male", ["modern", "career"], ["\u62A4\u5DE5", "\u62A4\u58EB", "\u533B\u9662", "\u670D\u52A1\u4E1A"], "\u7537\u62A4\u5DE5\u3001\u62A4\u7406\u5458\u3001\u533B\u9662\u670D\u52A1\u89D2\u8272\uFF0C\u8F6F\u5236\u670D\u548C\u8F6F\u5E95\u978B\uFF0C\u548C\u533B\u751F\u897F\u88C5/\u767D\u5927\u8902\u533A\u5206\u3002", slots2(
    "\u5185\u642D\uFF1A\u5438\u6C57\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u4FBF\u4E8E\u5DE5\u4F5C",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u77ED\u8896\u6216\u957F\u8896\u62A4\u7406\u5236\u670D\u4E0A\u8863\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u65E0\u6587\u5B57",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u76F4\u7B52\u5DE5\u4F5C\u957F\u88E4\uFF0C\u65B9\u4FBF\u5F2F\u8170\u548C\u884C\u8D70",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u8584\u6B3E\u5DE5\u4F5C\u5916\u5957\u6216\u80CC\u5FC3\u5F0F\u5916\u5C42\uFF0C\u8F6E\u5ED3\u6574\u6D01",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u5DE5\u4F5C\u889C\u6750\uFF0C\u4F4E\u53CD\u5149\uFF0C\u9002\u5408\u957F\u65F6\u95F4\u7AD9\u7ACB",
    "\u978B\u5C65\uFF1A\u8F6F\u5E95\u5DE5\u4F5C\u978B\uFF0C\u978B\u5934\u5706\u6DA6\uFF0C\u5E72\u51C0\u8010\u7AD9\u7ACB",
    "\u88C5\u9970\uFF1A\u65E0\u5B57\u804C\u4E1A\u7ED3\u6784\u724C\u3001\u8155\u8868\u6216\u53E3\u888B\u8FB9\u7ED3\u6784\uFF0C\u4E0D\u624B\u6301\u5668\u68B0"
  ), ["21-28", "29-38", "39-50", "51-65"]),
  capsule2("modern-male-windbreaker-executive", "\u73B0\u4EE3\u7537\u6027\u98CE\u8863\u5546\u52A1\u88C5", "male", ["modern", "career"], ["\u603B\u88C1", "\u5F8B\u5E08", "\u7537\u4E3B", "\u6743\u529B", "\u8C03\u67E5"], "\u73B0\u4EE3\u7537\u6027\u98CE\u8863\u65B9\u5411\uFF0C\u7528\u957F\u5916\u5957\u8F6E\u5ED3\u5236\u9020\u89C6\u89C9\u951A\u70B9\uFF0C\u907F\u514D\u6240\u6709\u6B63\u5F0F\u7537\u6027\u90FD\u662F\u9ED1\u897F\u88C5\u3002", slots2(
    "\u5185\u642D\uFF1A\u886C\u886B\u6216\u8584\u9488\u7EC7\u5185\u642D\uFF0C\u9886\u53E3\u5C42\u6B21\u6E05\u695A",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u4FEE\u8EAB\u9A6C\u7532\u6216\u886C\u886B\u4E0A\u5C42\uFF0C\u80F8\u8170\u7EBF\u5229\u843D",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u76F4\u7B52\u897F\u88E4\u6216\u901A\u52E4\u957F\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u4E2D\u957F\u6B3E\u98CE\u8863\uFF0C\u7FFB\u9886\u548C\u8170\u5E26\u7ED3\u6784\u660E\u786E\uFF0C\u8863\u6446\u6709\u5782\u5760\u611F",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u7EC6\u9488\u7EC7\u889C\u6750\uFF0C\u9732\u51FA\u9762\u79EF\u5C0F",
    "\u978B\u5C65\uFF1A\u6263\u5E26\u76AE\u978B\u6216\u77ED\u9774\uFF0C\u978B\u578B\u4FEE\u957F",
    "\u88C5\u9970\uFF1A\u8155\u8868\u3001\u8896\u6263\u6216\u7A84\u56F4\u5DFE\u8FB9\u7F18\uFF0C\u7EC6\u8282\u5C0F\u9762\u79EF"
  ), ["29-38", "39-50"]),
  capsule2("modern-male-banquet-velvet-formal", "\u73B0\u4EE3\u7537\u6027\u5BB4\u4F1A\u4E1D\u7ED2\u793C\u670D\u88C5", "male", ["modern", "career"], ["\u665A\u5BB4", "\u540D\u6D41", "\u8D35\u516C\u5B50", "\u603B\u88C1", "\u8BA2\u5A5A\u5BB4"], "\u665A\u5BB4\u3001\u8BA2\u5A5A\u5BB4\u3001\u9152\u4F1A\u7537\u6027\u6B63\u5F0F\u72B6\u6001\uFF0C\u793C\u670D\u7248\u578B\u548C\u4E1D\u7ED2\u6750\u8D28\uFF0C\u540E\u7EED\u6309\u89D2\u8272\u8BBE\u8BA1\u3002", slots2(
    "\u5185\u642D\uFF1A\u793C\u670D\u886C\u886B\uFF0C\u9886\u53E3\u786C\u633A\uFF0C\u80F8\u524D\u8936\u4F4D\u7EC6\u5BC6",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u4FEE\u8EAB\u793C\u670D\u9A6C\u7532\uFF0C\u8170\u7EBF\u660E\u786E\uFF0C\u5E03\u9762\u4F4E\u53CD\u5149",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u793C\u670D\u897F\u88E4\uFF0C\u88E4\u7EBF\u9510\u5229\uFF0C\u5782\u5760\u987A\u76F4",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u4E1D\u7ED2\u6216\u7F0E\u9762\u7FFB\u9886\u793C\u670D\u5916\u5957\uFF0C\u80A9\u7EBF\u5E73\u76F4\uFF0C\u8170\u8EAB\u6536\u7A84",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u8584\u6B63\u88C5\u889C\u6750\uFF0C\u9690\u85CF\u5728\u88E4\u811A\u4E0B",
    "\u978B\u5C65\uFF1A\u793C\u670D\u4EAE\u9762\u978B\u6216\u725B\u6D25\u978B\uFF0C\u978B\u9762\u65E0\u6587\u5B57",
    "\u88C5\u9970\uFF1A\u9886\u7ED3\u3001\u8896\u6263\u3001\u80F8\u9488\u6216\u9886\u5E26\u5939\uFF0C\u514B\u5236\u4F46\u53EF\u89C1"
  ), ["21-28", "29-38", "39-50"]),
  capsule2("modern-male-vest-shirt-lawyer", "\u73B0\u4EE3\u7537\u6027\u9A6C\u7532\u886C\u886B\u804C\u4E1A\u88C5", "male", ["modern", "career"], ["\u5F8B\u5E08", "\u8BB0\u8005", "\u8001\u5E08", "\u804C\u4E1A", "\u7537\u4E3B"], "\u9A6C\u7532\u886C\u886B\u65B9\u5411\uFF0C\u9002\u5408\u6CD5\u5EAD\u3001\u529E\u516C\u5BA4\u3001\u8C03\u67E5\u7C7B\u955C\u5934\uFF0C\u6BD4\u5168\u5957\u897F\u88C5\u66F4\u6709\u5C42\u6B21\u3002", slots2(
    "\u5185\u642D\uFF1A\u886C\u886B\uFF0C\u9886\u53E3\u548C\u8896\u53E3\u633A\u62EC\uFF0C\u80A9\u7F1D\u4F4D\u7F6E\u7CBE\u51C6",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u4FEE\u8EAB\u9A6C\u7532\uFF0C\u80F8\u8170\u7EBF\u6E05\u695A\uFF0C\u6263\u4F4D\u6574\u9F50",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u9AD8\u8170\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u53EF\u642D\u77ED\u5916\u5957\u6216\u4E0D\u7A7F\u5916\u5957\uFF0C\u91CD\u70B9\u9732\u51FA\u9A6C\u7532\u5C42\u6B21",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u6B63\u88C5\u889C\u6750\uFF0C\u4F4E\u53CD\u5149",
    "\u978B\u5C65\uFF1A\u76AE\u978B\u6216\u4E50\u798F\u978B\uFF0C\u978B\u578B\u4FEE\u957F",
    "\u88C5\u9970\uFF1A\u9886\u5E26\u5939\u3001\u4E0D\u624B\u6301\u6587\u4EF6"
  ), ["21-28", "29-38", "39-50"]),
  capsule2("modern-female-business-formal-suit", "\u73B0\u4EE3\u5973\u6027\u5546\u52A1\u6B63\u88C5\u7EC4\u5408", "female", ["modern", "career"], ["\u5546\u52A1", "\u804C\u4E1A", "\u4E0A\u73ED\u65CF", "\u804C\u573A\u5973\u6027", "\u6B63\u88C5"], "\u73B0\u4EE3\u5973\u6027\u5546\u52A1\u6B63\u88C5\u65B9\u5411\uFF0C\u8F7B\u5546\u52A1\u3001\u5E72\u7EC3\u3001\u4E13\u4E1A\uFF0C\u9002\u5408\u804C\u4E1A\u5973\u6027\u3001\u804C\u573A\u7BA1\u7406\u8005\u3001\u666E\u901A\u804C\u573A\u5973\u4E3B\u3002", slots2(
    "\u5185\u642D\uFF1A\u9AD8\u652F\u68C9\u886C\u886B\u6216\u9488\u7EC7\u5185\u5C42\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u80A9\u9888\u7EBF\u5E72\u51C0",
    "\u4E0A\u88C5/\u4E0A\u5C42\uFF1A\u8F7B\u5546\u52A1\u5355\u6392\u6263\u897F\u88C5\u4E0A\u5C42\uFF0C\u80A9\u7EBF\u81EA\u7136\uFF0C\u8170\u8EAB\u5229\u843D",
    "\u4E0B\u88C5/\u4E0B\u6446\uFF1A\u9AD8\u8170\u76F4\u7B52\u897F\u88E4\u6216\u8FC7\u819D\u94C5\u7B14\u88D9\uFF0C\u88E4\u7EBF\u6E05\u695A\uFF0C\u884C\u52A8\u65B9\u4FBF",
    "\u5916\u5957/\u5916\u5C42\uFF1A\u77ED\u6B3E\u6B63\u88C5\u897F\u88C5\u5916\u5957\uFF0C\u7FFB\u9886\u6E05\u695A\uFF0C\u5E03\u6599\u54D1\u5149\uFF0C\u975E\u539A\u91CD\u793C\u670D\u611F",
    "\u817F\u90E8\u6750\u8D28\uFF1A\u7EC6\u9488\u7EC7\u6B63\u88C5\u889C\u6750\uFF0C\u9732\u51FA\u9762\u79EF\u514B\u5236",
    "\u978B\u5C65\uFF1A\u5C16\u5934\u4F4E\u8DDF\u76AE\u978B\u6216\u4E50\u798F\u978B\uFF0C\u978B\u578B\u4FEE\u957F\uFF0C\u4F4E\u53CD\u5149",
    "\u88C5\u9970\uFF1A\u8155\u8868\u3001\u7EC6\u8033\u9970\u6216\u80F8\u9488\uFF0C\u5C0F\u9762\u79EF\u7EC6\u8282\uFF0C\u4E0D\u624B\u6301\u6587\u4EF6"
  ), ["21-28", "29-38", "39-50"])
];

// services/characterStylingWardrobeCapsulesDiversity.ts
var slot3 = (detail, material) => ({
  label: detail.replace(/[，,].*$/, ""),
  material: material || detail,
  detail
});
var c = (id, label, gender, eras, roleTags, summary, slots3, ageBands) => ({
  id,
  label,
  gender,
  eras,
  roleTags,
  summary,
  ageBands,
  slots: Object.fromEntries(
    Object.entries(slots3).map(([key, detail]) => [key, slot3(detail)])
  )
});
var DIVERSITY_WARDROBE_CAPSULES = [
  // ================= 日常 / 家常 =================
  c("div-daily-male-knit-cardigan", "\u7537\u9488\u7EC7\u5F00\u886B\u5C45\u5BB6\u5957\u88C5", "male", ["modern"], ["\u7236\u4EB2", "\u5C45\u5BB6", "\u6E29\u548C", "\u65E5\u5E38"], "\u5C45\u5BB6\u6E29\u548C\u7537\u6027\u65E5\u5E38, \u677E\u5F1B\u4E0D\u908B\u9062\u3002", {
    inner: "\u5706\u9886\u7EAF\u68C9T\u6064, \u9886\u53E3\u5E73\u6574, \u9762\u6599\u5E26\u8F7B\u5FAE\u6C34\u6D17\u7EB9\u7406",
    top: "\u7C97\u9488\u7EC7\u5F00\u886B, \u5927\u5E45\u7F57\u7EB9\u8896\u53E3, \u6728\u8D28\u6263, \u843D\u80A9\u526A\u88C1",
    bottom: "\u76F4\u7B52\u4F11\u95F2\u957F\u88E4, \u9762\u6599\u67D4\u8F6F\u6709\u5782\u611F, \u88E4\u811A\u5FAE\u6536",
    outerwear: "\u65E0\u5916\u5957\u5C42, \u5F00\u886B\u5373\u5916\u5C42",
    legwear: "\u666E\u901A\u68C9\u889C, \u4E0D\u62A2\u955C",
    shoes: "\u4E00\u811A\u8E6C\u8F6F\u5E95\u4FBF\u978B, \u5706\u5934, \u978B\u9762\u7D20\u51C0",
    accessory: "\u8001\u5F0F\u8155\u8868, \u8868\u5E26\u78E8\u635F\u81EA\u7136"
  }, ["39-50", "51-65"]),
  c("div-daily-male-plaid-shirt", "\u7537\u683C\u7EB9\u886C\u886B\u5DE5\u4F11\u5957\u88C5", "male", ["modern", "rural"], ["\u6280\u672F\u5458", "\u53F8\u673A", "\u65E5\u5E38", "\u5B9E\u5E72"], "\u5B9E\u5E72\u578B\u7537\u6027\u65E5\u5E38, \u683C\u7EB9\u886C\u886B\u52A0\u5DE5\u88C5\u88E4\u7684\u8010\u78E8\u7EC4\u5408\u3002", {
    inner: "\u5706\u9886\u8584\u6253\u5E95\u886B, \u8D34\u8EAB\u4E0D\u81C3\u80BF",
    top: "\u4E2D\u683C\u7EB9\u6CD5\u5170\u7ED2\u886C\u886B, \u53CC\u8D34\u888B, \u8896\u53E3\u53EF\u633D\u8D77\u9732\u51FA\u5C0F\u81C2",
    bottom: "\u591A\u888B\u5DE5\u88C5\u957F\u88E4, \u819D\u90E8\u6709\u7ACB\u4F53\u526A\u88C1, \u8010\u78E8\u5E06\u5E03",
    outerwear: "\u65E0\u5916\u5957\u5C42, \u886C\u886B\u5916\u7A7F",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u0441\u0438\u0441\u0442\u0435\u043Cy\u5DE5\u88C5\u9774, \u5706\u5934\u539A\u5E95, \u978B\u5E2E\u6709\u8F66\u7EBF",
    accessory: "\u5E06\u5E03\u8170\u5E26, \u91D1\u5C5E\u6263\u5177\u6734\u7D20"
  }, ["21-28", "29-38", "39-50"]),
  c("div-daily-male-polo-casual", "\u7537polo\u886B\u4F11\u95F2\u88E4\u5957\u88C5", "male", ["modern"], ["\u5E97\u4E3B", "\u4E2D\u5C42", "\u65E5\u5E38", "\u4F53\u9762"], "\u5C0F\u751F\u610F\u4EBA/\u4E2D\u5C42\u7684\u4F53\u9762\u65E5\u5E38, \u4E0D\u6B63\u5F0F\u4F46\u6574\u6D01\u3002", {
    inner: "polo\u886B\u672C\u8EAB\u4E3A\u5185\u5916\u5C42, \u4E09\u7C92\u6263\u95E8\u895F",
    top: "\u73E0\u5730\u7F51\u773Cpolo\u886B, \u7F57\u7EB9\u9886, \u4E0B\u6446\u5F00\u8869",
    bottom: "\u514D\u70EB\u4F11\u95F2\u897F\u88E4, \u88E4\u7EBF\u6D45, \u8170\u5934\u6709\u677E\u7D27\u4FA7\u7247",
    outerwear: "\u65E0",
    legwear: "\u4E2D\u7B52\u68C9\u889C",
    shoes: "\u8F6F\u76AE\u4F11\u95F2\u978B, \u7F1D\u7EBF\u5916\u9732, \u978B\u578B\u5706\u6DA6",
    accessory: "\u94A5\u5319\u4E32\u6302\u8170\u4FA7, \u751F\u6D3B\u6C14\u606F"
  }, ["29-38", "39-50", "51-65"]),
  c("div-daily-male-down-vest", "\u7537\u7FBD\u7ED2\u9A6C\u7532\u53E0\u7A7F\u5957\u88C5", "male", ["modern", "rural"], ["\u7236\u4EB2", "\u51AC\u88C5", "\u63A5\u5730\u6C14", "\u65E5\u5E38"], "\u5317\u65B9\u51AC\u65E5\u5E38\u89C1\u7684\u9A6C\u7532\u53E0\u7A7F, \u884C\u52A8\u5229\u843D\u3002", {
    inner: "\u9AD8\u9886\u8584\u6BDB\u8863, \u7F57\u7EB9\u9886\u53E3\u8D34\u5408",
    top: "\u886C\u886B\u5916\u53E0\u8F7B\u91CF\u7FBD\u7ED2\u9A6C\u7532, \u8F66\u7EBF\u683C\u7EB9, \u7ACB\u9886",
    bottom: "\u52A0\u7ED2\u76F4\u7B52\u88E4, \u539A\u5B9E\u4F46\u4E0D\u81C3\u80BF",
    outerwear: "\u9A6C\u7532\u5373\u5916\u5C42",
    legwear: "\u52A0\u539A\u68C9\u889C",
    shoes: "\u9632\u6ED1\u4F11\u95F2\u68C9\u978B, \u978B\u5E2E\u52A0\u539A",
    accessory: "\u7EBF\u7EC7\u56F4\u5DFE\u968F\u610F\u7ED5\u4E00\u5708"
  }, ["39-50", "51-65"]),
  c("div-daily-male-hoodie-young", "\u7537\u8FDE\u5E3D\u536B\u8863\u8857\u5934\u5957\u88C5", "male", ["modern", "campus"], ["\u9752\u5E74", "\u5B66\u751F", "\u8857\u5934", "\u65E5\u5E38"], "\u57CE\u5E02\u9752\u5E74\u57FA\u672C\u6B3E, \u677E\u5F1B\u8857\u5934\u611F\u3002", {
    inner: "\u5706\u9886T\u6064, \u4E0B\u6446\u7565\u957F\u9732\u51FA\u5C42\u6B21",
    top: "\u91CD\u78C5\u8FDE\u5E3D\u536B\u8863, \u888B\u9F20\u515C, \u62BD\u7EF3\u7C97\u5B9E",
    bottom: "\u9525\u5F62\u675F\u811A\u88E4, \u4FA7\u7F1D\u6709\u7EC7\u5E26\u7EC6\u8282",
    outerwear: "\u65E0",
    legwear: "\u4E2D\u7B52\u8FD0\u52A8\u889C, \u7F57\u7EB9\u53E3",
    shoes: "\u590D\u53E4\u6162\u8DD1\u978B, \u62FC\u63A5\u978B\u9762, \u539A\u5E95",
    accessory: "\u5C3C\u9F99\u659C\u630E\u5C0F\u5305\u8D34\u8EAB"
  }, ["16-20", "21-28"]),
  c("div-daily-male-tang-jacket", "\u7537\u6539\u826F\u5510\u88C5\u5957\u88C5", "male", ["modern", "period"], ["\u957F\u8F88", "\u624B\u827A\u4EBA", "\u4F20\u7EDF", "\u65E5\u5E38"], "\u4F20\u7EDF\u6C14\u8D28\u957F\u8F88/\u624B\u827A\u4EBA, \u76D8\u6263\u7ACB\u9886\u7684\u6539\u826F\u5510\u88C5\u3002", {
    inner: "\u7ACB\u9886\u68C9\u8D28\u5185\u886C\u886B",
    top: "\u6539\u826F\u5510\u88C5\u4E0A\u8863, \u624B\u5DE5\u76D8\u6263, \u7F0E\u9762\u6EDA\u8FB9, \u633A\u62EC\u7ACB\u9886",
    bottom: "\u76F4\u7B52\u68C9\u9EBB\u957F\u88E4, \u5782\u611F\u81EA\u7136",
    outerwear: "\u65E0",
    legwear: "\u68C9\u889C",
    shoes: "\u5706\u53E3\u5E03\u978B, \u5343\u5C42\u5E95",
    accessory: "\u624B\u4E32\u73E0\u5B50\u76D8\u51FA\u5305\u6D46"
  }, ["51-65", "66-80"]),
  c("div-daily-male-apron-cook", "\u7537\u56F4\u88D9\u5BB6\u5E38\u638C\u52FA\u5957\u88C5", "male", ["modern"], ["\u4E08\u592B", "\u638C\u52FA", "\u5C45\u5BB6", "\u70DF\u706B\u6C14"], "\u5BB6\u91CC\u638C\u52FA\u7684\u7537\u4EBA, \u56F4\u88D9\u4E00\u7CFB\u70DF\u706B\u6C14\u5341\u8DB3\u3002", {
    inner: "\u5706\u9886\u5BB6\u5C45T\u6064, \u8896\u53E3\u5377\u5230\u5C0F\u81C2",
    top: "\u534A\u8EAB\u53A8\u7528\u56F4\u88D9\u7CFB\u5728\u8170\u95F4, \u5E06\u5E03\u539A\u5B9E, \u524D\u7F6E\u5927\u53E3\u888B",
    bottom: "\u5BBD\u677E\u5BB6\u5C45\u957F\u88E4",
    outerwear: "\u65E0",
    legwear: "\u68C9\u889C",
    shoes: "\u8F6F\u5E95\u62D6\u978B\u5F0F\u5BB6\u5C45\u978B",
    accessory: "\u642D\u5728\u80A9\u4E0A\u7684\u64E6\u624B\u6BDB\u5DFE"
  }, ["29-38", "39-50", "51-65"]),
  c("div-daily-female-knit-homely", "\u5973\u6E29\u8F6F\u9488\u7EC7\u5BB6\u5E38\u5957\u88C5", "female", ["modern"], ["\u6BCD\u4EB2", "\u59BB\u5B50", "\u5C45\u5BB6", "\u6E29\u67D4"], "\u6E29\u67D4\u6301\u5BB6\u7684\u5973\u6027\u65E5\u5E38, \u9488\u7EC7\u8D28\u611F\u677E\u5F1B\u67D4\u8F6F\u3002", {
    inner: "\u4FEE\u8EAB\u5706\u9886\u6253\u5E95\u886B, \u9762\u6599\u7EC6\u817B",
    top: "\u7ED2\u8F6F\u8D28\u611F\u7C97\u68D2\u9488\u5F00\u886B, \u6CE1\u6CE1\u8896\u53E3, \u5927\u8EAB\u5BBD\u677E",
    bottom: "\u9AD8\u8170\u9614\u817F\u9488\u7EC7\u88E4, \u5782\u5760\u8D34\u5730",
    outerwear: "\u5F00\u886B\u5373\u5916\u5C42",
    legwear: "\u8584\u7F8A\u6BDB\u889C",
    shoes: "\u5706\u5934\u5E73\u5E95\u8C46\u8C46\u978B, \u8F6F\u9762",
    accessory: "\u7EC6\u91D1\u5C5E\u5C0F\u8033\u9489, \u4F4E\u8C03"
  }, ["29-38", "39-50"]),
  c("div-daily-female-floral-apron", "\u5973\u788E\u82B1\u56F4\u88D9\u6301\u5BB6\u5957\u88C5", "female", ["modern", "rural"], ["\u5A46\u5A46", "\u6BCD\u4EB2", "\u53A8\u623F", "\u70DF\u706B\u6C14"], "\u7076\u53F0\u8FB9\u7684\u6301\u5BB6\u5973\u6027, \u788E\u82B1\u56F4\u88D9\u662F\u8EAB\u4EFD\u7B26\u53F7\u3002", {
    inner: "\u5706\u9886\u8584\u6BDB\u8863, \u8896\u53E3\u7F57\u7EB9, \u9762\u6599\u8D77\u7EC6\u7403",
    top: "\u53CA\u819D\u788E\u82B1\u56F4\u88D9, \u4EA4\u53C9\u80CC\u5E26, \u524D\u888B\u9F13\u9F13",
    bottom: "\u76F4\u7B52\u539A\u68C9\u88E4, \u88E4\u8170\u677E\u7D27, \u8E72\u8D77\u5229\u843D",
    outerwear: "\u65E0",
    legwear: "\u539A\u68C9\u889C, \u889C\u53E3\u677E\u5F1B\u5806\u5728\u8E1D\u4E0A",
    shoes: "\u9632\u6ED1\u68C9\u5E03\u978B, \u978B\u5E95\u8F6F, \u7076\u53F0\u524D\u7AD9\u5F97\u4F4F",
    accessory: "\u8896\u5957\u4E00\u5BF9, \u8FB9\u7F18\u677E\u7D27, \u53E3\u888B\u91CC\u585E\u7740\u62B9\u5E03"
  }, ["39-50", "51-65", "66-80"]),
  c("div-daily-female-shirt-mom", "\u5973\u886C\u886B\u534A\u88D9\u77E5\u6027\u65E5\u5E38", "female", ["modern"], ["\u6559\u5E08", "\u6BCD\u4EB2", "\u77E5\u6027", "\u65E5\u5E38"], "\u77E5\u6027\u6E29\u548C\u7684\u5973\u6027\u65E5\u5E38, \u886C\u886B\u534A\u88D9\u4E0D\u5931\u4EB2\u548C\u3002", {
    inner: "\u886C\u886B\u672C\u8EAB\u4E3A\u4E3B\u5C42",
    top: "\u7EC6\u6761\u7EB9\u68C9\u886C\u886B, \u5C0F\u5706\u9886, \u8896\u53E3\u53CC\u6263",
    bottom: "\u53CA\u819DA\u5B57\u534A\u88D9, \u8170\u5934\u6536\u8936, \u88D9\u6446\u633A\u62EC",
    outerwear: "\u8584\u9488\u7EC7V\u9886\u80CC\u5FC3\u53E0\u7A7F",
    legwear: "\u80A4\u8272\u8584\u889C",
    shoes: "\u4F4E\u8DDF\u739B\u4E3D\u73CD\u978B, \u5706\u5934\u642D\u5E26",
    accessory: "\u7EC6\u94FE\u5355\u5760\u9879\u94FE"
  }, ["29-38", "39-50"]),
  c("div-daily-female-sweater-jeans", "\u5973\u6BDB\u8863\u725B\u4ED4\u88E4\u8F7B\u677E\u5957\u88C5", "female", ["modern", "campus"], ["\u9752\u5E74", "\u90BB\u5BB6", "\u65E5\u5E38", "\u677E\u5F1B"], "\u90BB\u5BB6\u611F\u5E74\u8F7B\u5973\u6027, \u6BDB\u8863\u914D\u725B\u4ED4\u88E4\u6C38\u4E0D\u51FA\u9519\u3002", {
    inner: "\u5706\u9886T\u6064\u6253\u5E95",
    top: "\u6175\u61D2\u5ED3\u5F62\u5706\u9886\u6BDB\u8863, \u843D\u80A9, \u4E0B\u6446\u7F57\u7EB9",
    bottom: "\u76F4\u7B52\u725B\u4ED4\u88E4, \u5FAE\u78E8\u767D, \u88E4\u811A\u5377\u8FB9",
    outerwear: "\u65E0",
    legwear: "\u5806\u5806\u889C",
    shoes: "\u5E06\u5E03\u978B, \u978B\u5934\u5305\u80F6",
    accessory: "\u5E06\u5E03\u6258\u7279\u5305\u630E\u80A9"
  }, ["16-20", "21-28", "29-38"]),
  c("div-daily-female-qipao-daily", "\u5973\u65E5\u5E38\u6539\u826F\u65D7\u888D", "female", ["modern", "republican"], ["\u4F18\u96C5", "\u8001\u677F\u5A18", "\u4F20\u7EDF", "\u6C14\u8D28"], "\u6C14\u8D28\u578B\u5973\u6027\u7684\u6539\u826F\u65D7\u888D\u65E5\u5E38, \u4E0D\u9686\u91CD\u4F46\u6709\u97F5\u5473\u3002", {
    inner: "\u65D7\u888D\u672C\u4F53\u4E3A\u4E3B\u5C42",
    top: "\u6539\u826F\u65E5\u5E38\u65D7\u888D, \u53CA\u819D\u957F\u5EA6, \u77ED\u8896\u5305\u8FB9, \u4FA7\u5F00\u8869\u6536\u655B",
    bottom: "\u65D7\u888D\u8FDE\u4F53",
    outerwear: "\u8584\u9488\u7EC7\u5C0F\u5F00\u886B\u62AB\u80A9\u5F0F\u642D\u5728\u80A9\u4E0A",
    legwear: "\u80A4\u8272\u4E1D\u889C",
    shoes: "\u4E2D\u8DDF\u5706\u5934\u5355\u978B, \u7F0E\u9762",
    accessory: "\u7389\u956F\u4E00\u53EA"
  }, ["29-38", "39-50", "51-65"]),
  c("div-daily-female-tracksuit", "\u5973\u8FD0\u52A8\u4F11\u95F2\u65E5\u5E38\u5957\u88C5", "female", ["modern"], ["\u5B9D\u5988", "\u6D3B\u529B", "\u65E5\u5E38", "\u5229\u843D"], "\u63A5\u9001\u5B69\u5B50\u4E70\u83DC\u4E24\u4E0D\u8BEF\u7684\u6D3B\u529B\u65E5\u5E38\u3002", {
    inner: "\u901F\u5E72\u5706\u9886T\u6064",
    top: "\u7ACB\u9886\u8F7B\u8584\u8FD0\u52A8\u5916\u5957, \u62C9\u94FE\u8D34\u888B, \u8896\u53E3\u6536\u7D27",
    bottom: "\u9525\u5F62\u8FD0\u52A8\u957F\u88E4, \u4FA7\u6761\u7EB9\u7EC7\u5E26",
    outerwear: "\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u8FD0\u52A8\u77ED\u889C",
    shoes: "\u8F7B\u91CF\u8DD1\u978B, \u7F51\u9762\u900F\u6C14",
    accessory: "\u8FD0\u52A8\u53D1\u5E26\u675F\u4F4F\u788E\u53D1"
  }, ["21-28", "29-38", "39-50"]),
  c("div-daily-female-suspender-skirt", "\u5973\u80CC\u5E26\u88D9\u8F6F\u59B9\u65E5\u5E38", "female", ["modern", "campus"], ["\u5C11\u5973", "\u8F6F\u840C", "\u5B66\u751F", "\u65E5\u5E38"], "\u5C11\u5973\u611F\u80CC\u5E26\u88D9, \u8F6F\u840C\u4F46\u4E0D\u5E7C\u7A1A\u3002", {
    inner: "\u6CE1\u6CE1\u8896\u5706\u9886\u4E0A\u8863, \u8896\u53E3\u677E\u7D27",
    top: "\u80CC\u5E26\u8FDE\u8863\u88D9, \u524D\u80F8\u65B9\u6263, \u88D9\u6446A\u5B57\u8FC7\u819D",
    bottom: "\u88D9\u88C5\u8FDE\u4F53, A\u5B57\u88D9\u6446\u8FC7\u819D, \u8D70\u52A8\u65F6\u8F7B\u6446",
    outerwear: "\u65E0",
    legwear: "\u53CA\u819D\u68C9\u889C, \u889C\u53E3\u7F57\u7EB9, \u6536\u5728\u819D\u4E0B",
    shoes: "\u5706\u5934\u5C0F\u76AE\u978B, \u642D\u5E26\u5355\u6263, \u978B\u9762\u5149\u6D01",
    accessory: "\u5E03\u827A\u53D1\u5939\u4E00\u5BF9, \u522B\u5728\u9B13\u89D2\u4E24\u4FA7"
  }, ["16-20", "21-28"]),
  c("div-daily-male-linen-summer", "\u7537\u4E9A\u9EBB\u590F\u65E5\u5957\u88C5", "male", ["modern"], ["\u6587\u827A", "\u5E97\u4E3B", "\u590F\u88C5", "\u900F\u6C14"], "\u590F\u65E5\u6E05\u723D\u4E9A\u9EBB\u8D28\u611F, \u6587\u827A\u677E\u5F1B\u3002", {
    inner: "\u4E9A\u9EBB\u5706\u9886T\u6064, \u5E03\u7EB9\u808C\u7406\u660E\u663E",
    top: "\u4E9A\u9EBB\u5F00\u895F\u77ED\u8896\u886C\u886B\u5916\u7A7F\u4E0D\u7CFB\u6263",
    bottom: "\u4E9A\u9EBB\u4E5D\u5206\u76F4\u7B52\u88E4, \u88E4\u811A\u9732\u8E1D",
    outerwear: "\u65E0",
    legwear: "\u8239\u889C\u9690\u5F62, \u5B8C\u5168\u85CF\u5728\u978B\u53E3\u5185",
    shoes: "\u4E00\u811A\u8E6C\u5E06\u5E03\u61D2\u4EBA\u978B, \u978B\u8EAB\u8F6F\u584C\u8D34\u811A",
    accessory: "\u7F16\u7EC7\u624B\u7EF3\u7ED5\u8155\u4E24\u5708, \u7EF3\u5934\u7559\u7740\u6D41\u82CF"
  }, ["21-28", "29-38", "39-50"]),
  c("div-daily-female-summer-dress", "\u5973\u68C9\u9EBB\u8FDE\u8863\u88D9\u590F\u65E5\u5E38", "female", ["modern", "rural"], ["\u6E05\u65B0", "\u590F\u88C5", "\u65E5\u5E38", "\u6E29\u5A49"], "\u590F\u65E5\u68C9\u9EBB\u8FDE\u8863\u88D9, \u6E05\u98CE\u4E00\u6837\u7684\u65E5\u5E38\u611F\u3002", {
    inner: "\u8FDE\u8863\u88D9\u672C\u4F53",
    top: "\u68C9\u9EBB\u53CA\u8E1D\u8FDE\u8863\u88D9, \u5C0F\u65B9\u9886, \u6728\u8D28\u5C0F\u6263\u534A\u95E8\u895F, \u8170\u95F4\u7CFB\u5E26",
    bottom: "\u88D9\u88C5\u8FDE\u4F53",
    outerwear: "\u65E0",
    legwear: "\u5149\u817F\u6216\u8239\u889C",
    shoes: "\u4E00\u5B57\u5E26\u5E73\u5E95\u51C9\u978B",
    accessory: "\u8349\u7F16\u906E\u9633\u5E3D\u62FF\u5728\u624B\u4FA7(\u4E0D\u6234)"
  }, ["21-28", "29-38"]),
  // ================= 薄档位: 16-20 =================
  c("div-teen-male-school-uniform", "\u7537\u4E2D\u5B66\u6821\u670D\u5957\u88C5", "male", ["campus"], ["\u5B66\u751F", "\u6821\u670D", "\u5C11\u5E74", "\u5236\u670D"], "\u6807\u51C6\u4E2D\u5B66\u6821\u670D, \u5C11\u5E74\u6C14\u4E0E\u5236\u5F0F\u611F\u5E76\u5B58\u3002", {
    inner: "\u5706\u9886T\u6064\u6253\u5E95",
    top: "\u62FC\u8272\u8FD0\u52A8\u6821\u670D\u5916\u5957, \u7ACB\u9886\u62C9\u94FE, \u80F8\u524D\u6821\u5FBD\u4F4D\u7F6E\u7559\u767D",
    bottom: "\u540C\u6B3E\u76F4\u7B52\u6821\u670D\u88E4, \u4FA7\u7F1D\u62FC\u6761",
    outerwear: "\u6821\u670D\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u8FD0\u52A8\u889C",
    shoes: "\u8FD0\u52A8\u978B, \u7B80\u6D01",
    accessory: "\u53CC\u80A9\u4E66\u5305\u5355\u80A9\u80CC"
  }, ["16-20"]),
  c("div-teen-male-basketball", "\u7537\u6821\u56ED\u7BEE\u7403\u5C11\u5E74\u5957\u88C5", "male", ["campus", "modern"], ["\u4F53\u80B2\u751F", "\u7BEE\u7403", "\u9633\u5149", "\u5C11\u5E74"], "\u64CD\u573A\u4E0A\u7684\u9633\u5149\u4F53\u80B2\u751F\u3002", {
    inner: "\u65E0\u8896\u901F\u5E72\u80CC\u5FC3, \u5927\u81C2\u88F8\u9732",
    top: "\u5BBD\u677E\u7BEE\u7403\u77ED\u8896\u7F69\u5728\u80CC\u5FC3\u5916",
    bottom: "\u8FC7\u819D\u7BEE\u7403\u77ED\u88E4, \u4FA7\u5F00\u8869",
    outerwear: "\u65E0",
    legwear: "\u9AD8\u7B52\u8FD0\u52A8\u889C, \u53CC\u6760\u6761\u7EB9",
    shoes: "\u9AD8\u5E2E\u7BEE\u7403\u978B, \u539A\u5E95\u7F13\u9707",
    accessory: "\u8155\u5E26\u62A4\u8155\u4E00\u53EA"
  }, ["16-20"]),
  c("div-teen-male-bookish", "\u7537\u4E66\u5377\u5C11\u5E74\u886C\u886B\u5957\u88C5", "male", ["campus", "modern"], ["\u5B66\u9738", "\u6587\u9759", "\u773C\u955C", "\u5C11\u5E74"], "\u6587\u9759\u4E66\u5377\u6C14\u5C11\u5E74, \u6574\u6D01\u5230\u4E00\u4E1D\u4E0D\u82DF\u3002", {
    inner: "\u5706\u9886\u8584\u6253\u5E95",
    top: "\u6263\u5230\u9886\u53E3\u7684\u7EC6\u6761\u7EB9\u886C\u886B, \u71A8\u5E16\u5E73\u6574",
    bottom: "\u4E5D\u5206\u9525\u5F62\u897F\u88E4, \u88E4\u7EBF\u7B14\u76F4",
    outerwear: "V\u9886\u9488\u7EC7\u80CC\u5FC3\u53E0\u7A7F",
    legwear: "\u7D20\u51C0\u68C9\u889C, \u889C\u7B52\u8FC7\u8E1D, \u843D\u5EA7\u4E0D\u9732\u817F",
    shoes: "\u7CFB\u5E26\u76AE\u978B, \u978B\u5934\u5706\u6DA6, \u978B\u9762\u65E0\u82B1\u7EB9",
    accessory: "\u65E0\u660E\u663E\u914D\u9970"
  }, ["16-20", "21-28"]),
  c("div-teen-male-rebel-denim", "\u7537\u53DB\u9006\u5C11\u5E74\u725B\u4ED4\u5957\u88C5", "male", ["campus", "modern"], ["\u53DB\u9006", "\u8857\u5934", "\u5C11\u5E74", "\u6840\u9A9C"], "\u6840\u9A9C\u8857\u5934\u5C11\u5E74, \u725B\u4ED4\u5916\u5957\u7ACB\u8D77\u8863\u9886\u3002", {
    inner: "\u505A\u65E7\u5370\u82B1T\u6064(\u65E0\u53EF\u8BFB\u6587\u5B57)",
    top: "\u786C\u633A\u725B\u4ED4\u5916\u5957, \u94DC\u6263, \u9886\u53E3\u7ACB\u8D77",
    bottom: "\u7834\u6D1E\u76F4\u7B52\u725B\u4ED4\u88E4, \u819D\u90E8\u78E8\u767D",
    outerwear: "\u725B\u4ED4\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u62FC\u8272\u8FD0\u52A8\u889C",
    shoes: "\u5E06\u5E03\u9AD8\u5E2E\u978B, \u978B\u5E26\u677E\u7CFB",
    accessory: "\u91D1\u5C5E\u94FE\u6761\u6302\u88E4\u88A2"
  }, ["16-20", "21-28"]),
  c("div-teen-male-rural-boy", "\u7537\u4E61\u6751\u5C11\u5E74\u8010\u78E8\u5957\u88C5", "male", ["rural", "campus"], ["\u519C\u6751", "\u6734\u5B9E", "\u5C11\u5E74", "\u8010\u78E8"], "\u4E61\u6751\u5C11\u5E74\u7684\u6734\u5B9E\u8010\u78E8\u7A7F\u642D\u3002", {
    inner: "\u6D17\u5F97\u53D1\u767D\u7684\u5706\u9886T\u6064, \u9886\u53E3\u677E\u57AE\u53D8\u5F62",
    top: "\u62C9\u94FE\u5939\u514B, \u8896\u53E3\u78E8\u8FB9, \u7565\u5927\u4E00\u53F7",
    bottom: "\u8010\u78E8\u957F\u88E4, \u819D\u90E8\u8D77\u76B1, \u88E4\u811A\u5377\u8D77\u4E00\u6298",
    outerwear: "\u5939\u514B\u5373\u5916\u5C42",
    legwear: "\u539A\u68C9\u889C, \u889C\u7B52\u5806\u5728\u811A\u8E1D",
    shoes: "\u89E3\u653E\u978B\u5F0F\u80F6\u5E95\u5E03\u978B, \u978B\u8FB9\u6CBE\u7740\u5E72\u6CE5",
    accessory: "\u65E7\u624B\u7EF3\u78E8\u5F97\u8D77\u6BDB, \u7EF3\u7ED3\u677E\u6563"
  }, ["16-20"]),
  c("div-teen-female-school-jk", "\u5973\u5B66\u9662\u767E\u8936\u88D9\u5957\u88C5", "female", ["campus"], ["\u5B66\u751F", "\u5B66\u9662", "\u5C11\u5973", "\u6E05\u7EAF"], "\u6E05\u7EAF\u5B66\u9662\u98CE, \u767E\u8936\u88D9\u4E0E\u9488\u7EC7\u80CC\u5FC3\u3002", {
    inner: "\u5C0F\u5706\u9886\u886C\u886B, \u9886\u53E3\u7CFB\u7EC6\u9886\u7ED3",
    top: "V\u9886\u9488\u7EC7\u80CC\u5FC3, \u7F57\u7EB9\u6536\u8170",
    bottom: "\u53CA\u819D\u767E\u8936\u88D9, \u8936\u7EBF\u5229\u843D",
    outerwear: "\u65E0",
    legwear: "\u4E2D\u7B52\u6821\u889C, \u889C\u53E3\u7F57\u7EB9, \u6536\u5728\u819D\u4E0B",
    shoes: "\u5706\u5934\u76AE\u978B, \u978B\u9762\u5149\u6D01, \u978B\u5E26\u7CFB\u6210\u6574\u9F50\u8774\u8776\u7ED3",
    accessory: "\u53D1\u7EF3\u4F4E\u9A6C\u5C3E"
  }, ["16-20"]),
  c("div-teen-female-sporty", "\u5973\u5143\u6C14\u8FD0\u52A8\u5C11\u5973\u5957\u88C5", "female", ["campus", "modern"], ["\u4F53\u80B2", "\u5143\u6C14", "\u5C11\u5973", "\u6D3B\u529B"], "\u5143\u6C14\u6EE1\u6EE1\u7684\u8FD0\u52A8\u7CFB\u5C11\u5973\u3002", {
    inner: "\u901F\u5E72\u5706\u9886\u77EDT, \u9762\u6599\u900F\u6C14, \u4E0B\u6446\u7565\u6536",
    top: "\u77ED\u6B3E\u5F00\u886B\u8FD0\u52A8\u5916\u5957, \u534A\u62C9\u94FE",
    bottom: "\u9AD8\u8170\u8FD0\u52A8\u77ED\u88D9, \u5185\u886C\u5B89\u5168\u88E4",
    outerwear: "\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u4E2D\u7B52\u8FD0\u52A8\u889C, \u889C\u53E3\u7F57\u7EB9, \u8D34\u5408\u5C0F\u817F",
    shoes: "\u8F7B\u91CF\u8DD1\u978B, \u978B\u5E95\u56DE\u5F39, \u978B\u9762\u7F51\u773C\u900F\u6C14",
    accessory: "\u9AD8\u9A6C\u5C3E\u53D1\u5708, \u624B\u8155\u53E6\u5957\u4E00\u6839\u5907\u7528"
  }, ["16-20"]),
  c("div-teen-female-artsy", "\u5973\u6587\u827A\u5C11\u5973\u8FDE\u8863\u88D9", "female", ["campus", "modern"], ["\u6587\u827A", "\u5B89\u9759", "\u5C11\u5973", "\u753B\u5BA4"], "\u5B89\u9759\u6587\u827A\u7684\u5C11\u5973, \u88D9\u6446\u5E26\u7740\u753B\u5BA4\u6C14\u606F\u3002", {
    inner: "\u8FDE\u8863\u88D9\u672C\u4F53, \u706F\u82AF\u7ED2\u7AD6\u7EB9\u660E\u663E, \u624B\u611F\u539A\u5B9E",
    top: "\u706F\u82AF\u7ED2\u80CC\u5E26\u8FDE\u8863\u88D9, \u65B9\u9886, \u53CA\u819D\u88D9\u6446",
    bottom: "\u88D9\u88C5\u8FDE\u4F53, \u53CA\u819D\u88D9\u6446, \u8D70\u52A8\u65F6\u7EB9\u8DEF\u8D77\u4F0F",
    outerwear: "\u5185\u642D\u9AD8\u9886\u8584\u6BDB\u8863",
    legwear: "\u5806\u5806\u889C, \u889C\u7B52\u677E\u677E\u5806\u5728\u5C0F\u817F",
    shoes: "\u5706\u5934\u5E06\u5E03\u978B, \u978B\u5934\u6709\u6D17\u4E0D\u6389\u7684\u989C\u6599\u70B9",
    accessory: "\u5E06\u5E03\u675F\u53E3\u888B\u659C\u630E, \u888B\u53E3\u9732\u51FA\u753B\u7B14\u6746"
  }, ["16-20"]),
  c("div-teen-female-rural-girl", "\u5973\u4E61\u6751\u5C11\u5973\u6734\u7D20\u5957\u88C5", "female", ["rural", "campus"], ["\u519C\u6751", "\u61C2\u4E8B", "\u5C11\u5973", "\u6734\u7D20"], "\u65E9\u5F53\u5BB6\u7684\u4E61\u6751\u5C11\u5973, \u6734\u7D20\u5E72\u51C0\u3002", {
    inner: "\u5706\u9886\u68C9T\u6064, \u9762\u6599\u6D17\u5F97\u53D1\u8584, \u9886\u53E3\u7565\u677E",
    top: "\u6D17\u65E7\u9488\u7EC7\u5F00\u886B, \u8896\u53E3\u7565\u677E",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u88E4\u811A\u633D\u4E00\u6298",
    outerwear: "\u5F00\u886B\u5373\u5916\u5C42",
    legwear: "\u68C9\u77ED\u889C, \u889C\u53E3\u5377\u4E86\u4E00\u9053",
    shoes: "\u5851\u5E95\u5E03\u978B, \u978B\u5934\u78E8\u51FA\u6BDB\u8FB9, \u978B\u5E26\u7CFB\u5F97\u7D27",
    accessory: "\u9EBB\u82B1\u8FAB\u76AE\u7B4B, \u624B\u8155\u4E0A\u8FD8\u5957\u7740\u4E00\u6839\u5907\u7528"
  }, ["16-20"]),
  c("div-teen-female-streetwear", "\u5973\u6F6E\u6D41\u5C11\u5973oversize\u5957\u88C5", "female", ["modern", "campus"], ["\u6F6E\u6D41", "\u8857\u5934", "\u5C11\u5973", "\u9177"], "\u9177\u611F\u8857\u5934\u5C11\u5973, oversize\u5C42\u6B21\u53E0\u7A7F\u3002", {
    inner: "\u77ED\u6B3E\u540A\u5E26\u6253\u5E95, \u9762\u6599\u8D34\u8EAB, \u4E0B\u6446\u521A\u8FC7\u808B",
    top: "oversize\u77ED\u8896T\u7F69\u886B, \u4E0B\u6446\u8FC7\u80EF",
    bottom: "\u9AD8\u8170\u9614\u817F\u725B\u4ED4\u88E4, \u62D6\u5730\u957F\u5EA6",
    outerwear: "\u65E0",
    legwear: "\u4E2D\u7B52\u889C, \u889C\u53E3\u7F57\u7EB9, \u677E\u677E\u5806\u5728\u5C0F\u817F",
    shoes: "\u539A\u5E95\u8001\u7239\u978B, \u978B\u5E95\u5938\u5F20, \u978B\u5E26\u7C97\u4E14\u4E71\u7CFB",
    accessory: "\u68D2\u7403\u5E3D\u53CD\u6234, \u5E3D\u6A90\u538B\u5E73, \u8033\u673A\u7EBF\u5782\u5728\u80F8\u524D"
  }, ["16-20", "21-28"]),
  // ================= 老年档 =================
  c("div-elder-male-mao-suit", "\u7537\u8001\u6D3E\u4E2D\u5C71\u88C5\u5957\u88C5", "male", ["modern", "period", "elder"], ["\u8001\u5E72\u90E8", "\u957F\u8F88", "\u6B63\u5F0F", "\u5A01\u671B"], "\u6709\u5A01\u671B\u7684\u8001\u6D3E\u957F\u8F88, \u4E2D\u5C71\u88C5\u6263\u5230\u6700\u4E0A\u4E00\u9897\u3002", {
    inner: "\u7ACB\u9886\u68C9\u886C\u886B",
    top: "\u4E2D\u5C71\u88C5\u4E0A\u8863, \u56DB\u8D34\u888B, \u4E94\u6263\u7ACB\u9886, \u71A8\u7EBF\u7B14\u76F4",
    bottom: "\u540C\u6599\u76F4\u7B52\u957F\u88E4, \u88E4\u7EBF\u6E05\u6670",
    outerwear: "\u65E0",
    legwear: "\u6DF1\u7D20\u8272\u68C9\u889C",
    shoes: "\u5706\u5934\u8F6F\u76AE\u978B, \u978B\u9762\u64E6\u5F97\u53D1\u4EAE",
    accessory: "\u4E0A\u888B\u63D2\u4E00\u652F\u94A2\u7B14"
  }, ["66-80", "80+"]),
  c("div-elder-male-cardigan-grandpa", "\u7537\u6148\u7965\u7237\u7237\u5F00\u886B\u5957\u88C5", "male", ["modern", "elder"], ["\u7237\u7237", "\u6148\u7965", "\u5C45\u5BB6", "\u957F\u8F88"], "\u516C\u56ED\u957F\u6905\u4E0A\u6652\u592A\u9633\u7684\u6148\u7965\u7237\u7237\u3002", {
    inner: "\u683C\u7EB9\u68C9\u886C\u886B, \u9886\u53E3\u6263\u597D",
    top: "\u7C97\u9488\u7EC7\u7F8A\u6BDB\u5F00\u886B, \u524D\u895F\u4E94\u6263, \u53E3\u888B\u9F13\u7740\u8001\u82B1\u955C",
    bottom: "\u5BBD\u677E\u76F4\u7B52\u5462\u6599\u88E4",
    outerwear: "\u5F00\u886B\u5373\u5916\u5C42",
    legwear: "\u539A\u7F8A\u6BDB\u889C",
    shoes: "\u4E00\u811A\u8E6C\u8F6F\u5E95\u68C9\u978B",
    accessory: "\u8001\u82B1\u955C\u6302\u7EF3\u5782\u5728\u80F8\u524D"
  }, ["66-80", "80+"]),
  c("div-elder-male-vest-checkers", "\u7537\u68CB\u644A\u9A6C\u7532\u5927\u7237\u5957\u88C5", "male", ["modern", "rural", "elder"], ["\u5927\u7237", "\u68CB\u644A", "\u5E02\u4E95", "\u63A5\u5730\u6C14"], "\u5DF7\u53E3\u68CB\u644A\u8FB9\u7684\u5927\u7237, \u591A\u888B\u9A6C\u7532\u88C5\u7740\u534A\u5BFC\u4F53\u3002", {
    inner: "\u6C57\u886B\u6216\u5706\u9886T\u6064, \u9886\u53E3\u677E\u57AE, \u4E0B\u6446\u6396\u8FDB\u88E4\u8170",
    top: "\u591A\u53E3\u888B\u9493\u9C7C\u9A6C\u7532\u7F69\u5728\u886C\u886B\u5916",
    bottom: "\u5BBD\u677E\u4F11\u95F2\u88E4, \u88E4\u8170\u63D0\u5F97\u504F\u9AD8",
    outerwear: "\u9A6C\u7532\u5373\u5916\u5C42",
    legwear: "\u68C9\u77ED\u889C, \u889C\u53E3\u677E\u5F1B, \u9732\u51FA\u4E00\u622A\u811A\u8E1D",
    shoes: "\u5851\u5E95\u51C9\u978B\u6216\u5E03\u978B, \u978B\u9762\u88AB\u811A\u80CC\u6491\u51FA\u5F62",
    accessory: "\u84B2\u6247\u6216\u6536\u97F3\u673A\u968F\u8EAB, \u9A6C\u7532\u53E3\u888B\u9F13\u7740\u4E00\u5305\u70DF"
  }, ["66-80", "80+"]),
  c("div-elder-male-taichi", "\u7537\u6668\u7EC3\u592A\u6781\u670D\u5957\u88C5", "male", ["modern", "elder"], ["\u6668\u7EC3", "\u592A\u6781", "\u5EB7\u5065", "\u957F\u8005"], "\u516C\u56ED\u6668\u7EC3\u7684\u5EB7\u5065\u957F\u8005, \u592A\u6781\u670D\u5E26\u98CE\u3002", {
    inner: "\u5706\u9886\u68C9T\u6253\u5E95, \u9762\u6599\u8F7B\u8F6F, \u9886\u53E3\u5BBD\u677E\u4E0D\u675F\u9888",
    top: "\u592A\u6781\u670D\u4E0A\u8863, \u659C\u895F\u76D8\u6263, \u9762\u6599\u5782\u5760\u5E26\u5149",
    bottom: "\u592A\u6781\u706F\u7B3C\u88E4, \u88E4\u811A\u675F\u53E3",
    outerwear: "\u65E0",
    legwear: "\u8584\u68C9\u889C, \u889C\u53E3\u5E73\u6574, \u585E\u5728\u88E4\u811A\u675F\u53E3\u5185",
    shoes: "\u592A\u6781\u5E03\u978B, \u978B\u5E95\u8584\u8F6F, \u843D\u5730\u8D34\u5408",
    accessory: "\u6728\u8D28\u624B\u4E32\u7ED5\u8155\u4E24\u5708, \u73E0\u9762\u76D8\u5F97\u6E29\u6DA6"
  }, ["51-65", "66-80"]),
  c("div-elder-female-knit-grandma", "\u5973\u6148\u7965\u5976\u5976\u9488\u7EC7\u5957\u88C5", "female", ["modern", "elder"], ["\u5976\u5976", "\u6148\u7965", "\u5C45\u5BB6", "\u957F\u8F88"], "\u7ED9\u5B59\u8F88\u7EC7\u6BDB\u8863\u7684\u6148\u7965\u5976\u5976\u3002", {
    inner: "\u9AD8\u9886\u8584\u7ED2\u6253\u5E95\u886B, \u9886\u53E3\u8D34\u9888, \u9762\u6599\u8D77\u7EC6\u7ED2",
    top: "\u63D0\u82B1\u9488\u7EC7\u5F00\u886B, \u524D\u895F\u73E0\u6263, \u53E3\u888B\u5706\u6DA6",
    bottom: "\u677E\u7D27\u8170\u76F4\u7B52\u7ED2\u88E4, \u88E4\u7BA1\u5BBD\u677E, \u88E4\u811A\u7565\u5806",
    outerwear: "\u5F00\u886B\u5373\u5916\u5C42",
    legwear: "\u7F8A\u6BDB\u539A\u889C, \u889C\u7B52\u7EC7\u7EB9\u7C97, \u5806\u5728\u811A\u8E1D",
    shoes: "\u8F6F\u5E95\u5706\u53E3\u68C9\u978B, \u978B\u9762\u7EF5\u8F6F, \u8D70\u8DEF\u65E0\u58F0",
    accessory: "\u7D20\u8272\u53D1\u7B8D\u62E2\u4F4F\u9B13\u53D1, \u53E3\u888B\u91CC\u63D2\u7740\u6BDB\u7EBF\u9488"
  }, ["66-80", "80+"]),
  c("div-elder-female-silk-scarf", "\u5973\u9000\u4F11\u963F\u59E8\u4E1D\u5DFE\u5957\u88C5", "female", ["modern", "elder"], ["\u963F\u59E8", "\u5E7F\u573A", "\u4F53\u9762", "\u7CBE\u795E"], "\u7231\u62CD\u7167\u7684\u7CBE\u795E\u9000\u4F11\u963F\u59E8, \u4E1D\u5DFE\u662F\u7075\u9B42\u3002", {
    inner: "\u4FEE\u8EAB\u9AD8\u9886\u6253\u5E95\u886B, \u9762\u6599\u7EC6\u817B\u8D34\u8EAB, \u9886\u53E3\u633A\u7ACB",
    top: "\u6599\u5B50\u633A\u62EC\u7684\u53CA\u80EF\u98CE\u8863\u5F0F\u5916\u5957",
    bottom: "\u76F4\u7B52\u5FAE\u5587\u957F\u88E4, \u88E4\u7EBF\u7B14\u76F4, \u88E4\u811A\u76D6\u4F4F\u978B\u9762\u4E00\u534A",
    outerwear: "\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u80A4\u8272\u8584\u889C, \u8D28\u5730\u8F7B\u900F\u4E0D\u8D77\u76B1",
    shoes: "\u4F4E\u8DDF\u5706\u5934\u5355\u978B, \u978B\u9762\u5149\u6D01, \u8D70\u8DEF\u58F0\u8F7B",
    accessory: "\u5370\u82B1\u771F\u4E1D\u65B9\u5DFE\u7CFB\u5728\u9888\u95F4, \u7ED3\u6253\u5F97\u677E, \u4E00\u89D2\u5782\u5728\u80A9\u524D"
  }, ["51-65", "66-80"]),
  c("div-elder-female-market-tote", "\u5973\u4E70\u83DC\u5976\u5976\u788E\u82B1\u5957\u88C5", "female", ["modern", "rural", "elder"], ["\u5976\u5976", "\u5E02\u4E95", "\u4E70\u83DC", "\u63A5\u5730\u6C14"], "\u83DC\u5E02\u573A\u91CC\u773C\u660E\u624B\u5FEB\u7684\u5976\u5976\u3002", {
    inner: "\u788E\u82B1\u5706\u9886\u7F69\u8863, \u8896\u53E3\u677E\u7D27\u6536\u53E3",
    top: "\u8584\u5939\u68C9\u9A6C\u7532\u53E0\u7A7F, \u524D\u895F\u76D8\u6263, \u4E0B\u6446\u5BBD\u677E\u4E0D\u88F9\u8EAB",
    bottom: "\u5BBD\u677E\u76F4\u7B52\u5E03\u88E4, \u88E4\u8170\u677E\u7D27, \u8E72\u4E0B\u6311\u83DC\u65B9\u4FBF",
    outerwear: "\u9A6C\u7532\u5373\u5916\u5C42",
    legwear: "\u539A\u68C9\u77ED\u889C, \u889C\u7B52\u5806\u53E0\u5728\u811A\u8E1D",
    shoes: "\u5E73\u5E95\u9632\u6ED1\u5E03\u978B, \u978B\u5E95\u7EB9\u8DEF\u6DF1, \u8D70\u6E7F\u5730\u7A33\u5F53",
    accessory: "\u7F16\u7EC7\u83DC\u7BEE\u630E\u5728\u81C2\u5F2F, \u7BEE\u53E3\u9732\u51FA\u4E00\u622A\u8471\u53F6"
  }, ["66-80", "80+"]),
  c("div-elder-female-cheongsam-granny", "\u5973\u65D7\u888D\u8001\u592A\u592A\u5957\u88C5", "female", ["modern", "republican", "elder"], ["\u5927\u5BB6\u95FA\u79C0", "\u8BB2\u7A76", "\u65D7\u888D", "\u6C14\u5EA6"], "\u5E74\u8F7B\u65F6\u662F\u5927\u5BB6\u95FA\u79C0\u7684\u8BB2\u7A76\u8001\u592A\u592A\u3002", {
    inner: "\u65D7\u888D\u672C\u4F53, \u9762\u6599\u5782\u987A\u633A\u62EC, \u7ACB\u9886\u8D34\u9888",
    top: "\u6697\u7EB9\u63D0\u82B1\u53CA\u8E1D\u65D7\u888D, \u7ACB\u9886\u76D8\u6263, \u526A\u88C1\u5408\u4F53",
    bottom: "\u65D7\u888D\u8FDE\u4F53, \u53CA\u8E1D\u957F\u5EA6, \u4FA7\u5F00\u8869\u514B\u5236",
    outerwear: "\u7F8A\u7ED2\u62AB\u80A9\u56F4\u62E2\u80A9\u5934",
    legwear: "\u8584\u4E1D\u889C, \u8D28\u5730\u7EC6\u817B, \u6536\u5728\u978B\u53E3\u5185",
    shoes: "\u4F4E\u8DDF\u7F0E\u9762\u5355\u978B, \u978B\u9762\u5149\u6CFD\u67D4\u548C",
    accessory: "\u73CD\u73E0\u8033\u9489, \u76D8\u53D1\u63D2\u7C2A, \u8155\u95F4\u4E00\u53EA\u7389\u956F"
  }, ["66-80", "80+"]),
  // ================= 职业细分 =================
  c("div-job-male-delivery-rider", "\u7537\u5916\u5356\u9A91\u624B\u5236\u670D\u5957\u88C5", "male", ["modern"], ["\u9A91\u624B", "\u5916\u5356", "\u5236\u670D", "\u5954\u6CE2"], "\u98CE\u91CC\u6765\u96E8\u91CC\u53BB\u7684\u5916\u5356\u9A91\u624B\u3002", {
    inner: "\u901F\u5E72\u5706\u9886T\u6064",
    top: "\u9A91\u624B\u5236\u670D\u5939\u514B, \u53CD\u5149\u6761\u62FC\u63A5, \u7ACB\u9886\u9632\u98CE",
    bottom: "\u8010\u78E8\u675F\u811A\u5DE5\u88C5\u88E4",
    outerwear: "\u5236\u670D\u5939\u514B\u5373\u5916\u5C42",
    legwear: "\u8FD0\u52A8\u889C",
    shoes: "\u9632\u6ED1\u8FD0\u52A8\u978B, \u978B\u5934\u8010\u78E8",
    accessory: "\u5934\u76D4\u5939\u5728\u81C2\u5F2F(\u975E\u624B\u6301\u9053\u5177\u65F6\u7701\u7565)"
  }, ["21-28", "29-38"]),
  c("div-job-male-ride-driver", "\u7537\u7F51\u7EA6\u8F66\u53F8\u673A\u5957\u88C5", "male", ["modern"], ["\u53F8\u673A", "\u7F51\u7EA6\u8F66", "\u6574\u6D01", "\u5E02\u4E95"], "\u5E72\u51C0\u5229\u843D\u7684\u7F51\u7EA6\u8F66\u5E08\u5085\u3002", {
    inner: "polo\u886B, \u9886\u53E3\u5E73\u6574\u633A\u7ACB, \u8896\u53E3\u6536\u7D27\u4E0D\u62D6\u6C93",
    top: "\u8F7B\u8584\u5939\u514B\u655E\u7A7F, \u62C9\u94FE\u53EA\u62C9\u5230\u8170, \u9762\u6599\u6297\u76B1",
    bottom: "\u514D\u70EB\u4F11\u95F2\u88E4, \u88E4\u7EBF\u7B14\u76F4, \u843D\u5EA7\u4E0D\u663E\u8936",
    outerwear: "\u5939\u514B\u5373\u5916\u5C42",
    legwear: "\u8584\u68C9\u8239\u889C, \u957F\u65F6\u95F4\u8E29\u8E0F\u677F\u4E0D\u95F7",
    shoes: "\u8F6F\u5E95\u4F11\u95F2\u76AE\u978B, \u978B\u8DDF\u4F4E\u5E73, \u4FBF\u4E8E\u957F\u65F6\u8E29\u8E0F",
    accessory: "\u8170\u95F4\u6302\u8F66\u94A5\u5319\u6263, \u624B\u673A\u652F\u67B6\u7EBF\u7F20\u5728\u6276\u624B\u7BB1\u8FB9"
  }, ["29-38", "39-50"]),
  c("div-job-male-teacher-vest", "\u7537\u6559\u5E08\u9488\u7EC7\u80CC\u5FC3\u5957\u88C5", "male", ["modern", "campus"], ["\u6559\u5E08", "\u65AF\u6587", "\u8BB2\u53F0", "\u4EB2\u548C"], "\u8BB2\u53F0\u4E0A\u65AF\u6587\u4EB2\u548C\u7684\u7537\u6559\u5E08\u3002", {
    inner: "\u7EC6\u6761\u7EB9\u886C\u886B, \u8896\u53E3\u633D\u534A\u622A",
    top: "V\u9886\u9488\u7EC7\u80CC\u5FC3\u53E0\u886C\u886B",
    bottom: "\u76F4\u7B52\u897F\u88E4, \u88E4\u7EBF\u7B14\u76F4, \u88E4\u811A\u76D6\u4F4F\u978B\u9762",
    outerwear: "\u65E0",
    legwear: "\u7D20\u8272\u68C9\u889C, \u889C\u7B52\u8FC7\u8E1D, \u843D\u5EA7\u4E0D\u9732\u817F",
    shoes: "\u5706\u5934\u76AE\u978B, \u978B\u9762\u4F4E\u8C03, \u978B\u5934\u6709\u7EC6\u5FAE\u78E8\u75D5",
    accessory: "\u80F8\u888B\u522B\u4E00\u652F\u6279\u6539\u7B14, \u7B14\u5E3D\u78E8\u5F97\u53D1\u4EAE"
  }, ["29-38", "39-50", "51-65"]),
  c("div-job-male-programmer", "\u7537\u7A0B\u5E8F\u5458\u683C\u5B50\u4EBA\u5957\u88C5", "male", ["modern", "career"], ["\u7A0B\u5E8F\u5458", "\u52A0\u73ED", "IT", "\u75B2\u60EB"], "\u6DF1\u591C\u5DE5\u4F4D\u4E0A\u7684\u7A0B\u5E8F\u5458, \u8212\u9002\u538B\u8FC7\u4F53\u9762\u3002", {
    inner: "\u5706\u9886\u7EAF\u8272T\u6064",
    top: "\u683C\u7EB9\u886C\u886B\u655E\u7A7F\u5F53\u5916\u5957",
    bottom: "\u5BBD\u677E\u4F11\u95F2\u88E4",
    outerwear: "\u8FDE\u5E3D\u6293\u7ED2\u5916\u5957\u642D\u5728\u6905\u80CC(\u7A7F\u7740\u65F6\u4E3A\u5916\u5C42)",
    legwear: "\u8FD0\u52A8\u889C",
    shoes: "\u4E00\u811A\u8E6C\u8FD0\u52A8\u978B",
    accessory: "\u5DE5\u724C\u6302\u7EF3\u5782\u5728\u80F8\u524D(\u724C\u9762\u65E0\u53EF\u8BFB\u6587\u5B57)"
  }, ["21-28", "29-38"]),
  c("div-job-male-barber", "\u7537\u7406\u53D1\u5E08\u6F6E\u6D41\u5957\u88C5", "male", ["modern"], ["\u7406\u53D1\u5E08", "tony", "\u6F6E\u6D41", "\u624B\u827A"], "\u624B\u4E0A\u6709\u6D3B\u513F\u7684\u6F6E\u6D41\u7406\u53D1\u5E08\u3002", {
    inner: "\u4FEE\u8EAB\u9AD8\u9886\u8584\u9488\u7EC7\u886B, \u8896\u53E3\u7D27\u8D34\u5C0F\u81C2, \u4FBF\u4E8E\u62AC\u624B",
    top: "\u77ED\u6B3E\u76AE\u8D28\u56F4\u88D9\u7CFB\u5728\u8EAB\u524D, \u76AE\u9769\u5DE5\u5177\u88A2",
    bottom: "\u4E5D\u5206\u9525\u5F62\u88E4\u9732\u8E1D, \u88E4\u7EBF\u5229\u843D, \u88E4\u7BA1\u6536\u7D27",
    outerwear: "\u65E0",
    legwear: "\u8239\u889C, \u5B8C\u5168\u9690\u5728\u978B\u53E3\u5185",
    shoes: "\u4FA7\u62C9\u94FE\u5207\u5C14\u897F\u9774, \u978B\u7B52\u8FC7\u8E1D, \u978B\u5934\u7565\u65B9",
    accessory: "\u8155\u8868\u52A0\u591A\u679A\u7EC6\u6212\u6307, \u56F4\u88D9\u88A2\u4E0A\u522B\u7740\u526A\u5200\u4E0E\u68B3\u5B50"
  }, ["21-28", "29-38"]),
  c("div-job-male-fitness-coach", "\u7537\u5065\u8EAB\u6559\u7EC3\u7D27\u8EAB\u5957\u88C5", "male", ["modern"], ["\u6559\u7EC3", "\u5065\u8EAB", "\u4F53\u683C", "\u6D3B\u529B"], "\u4F53\u683C\u52B2\u633A\u7684\u5065\u8EAB\u6559\u7EC3\u3002", {
    inner: "\u7D27\u8EAB\u901F\u5E72\u77ED\u8896, \u80A9\u81C2\u7EBF\u6761\u6E05\u6670",
    top: "\u65E0\u5916\u5C42\u6216\u8FD0\u52A8\u5939\u514B\u655E\u7A7F",
    bottom: "\u9525\u5F62\u8FD0\u52A8\u957F\u88E4, \u9762\u6599\u5F39\u6027",
    outerwear: "\u8FD0\u52A8\u5939\u514B\u5373\u5916\u5C42",
    legwear: "\u4E2D\u7B52\u8FD0\u52A8\u889C",
    shoes: "\u8BAD\u7EC3\u978B, \u978B\u5E95\u7EB9\u8DEF\u9632\u6ED1",
    accessory: "\u7845\u80F6\u8FD0\u52A8\u8155\u5E26"
  }, ["21-28", "29-38"]),
  c("div-job-male-security-older", "\u7537\u5C0F\u533A\u4FDD\u5B89\u5236\u670D\u5957\u88C5", "male", ["modern"], ["\u4FDD\u5B89", "\u95E8\u5C97", "\u5236\u670D", "\u5C3D\u804C"], "\u95E8\u5C97\u4E0A\u5C3D\u804C\u7684\u4FDD\u5B89\u5E08\u5085\u3002", {
    inner: "\u5236\u5F0F\u886C\u886B, \u9886\u53E3\u89C4\u6574",
    top: "\u4FDD\u5B89\u5236\u670D\u5916\u5957, \u80A9\u88A2\u81C2\u7AE0\u4F4D, \u91D1\u5C5E\u6263",
    bottom: "\u5236\u5F0F\u76F4\u7B52\u88E4, \u88E4\u7EBF\u6E05\u695A",
    outerwear: "\u5236\u670D\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u6DF1\u7D20\u8272\u889C",
    shoes: "\u5236\u5F0F\u76AE\u978B",
    accessory: "\u5236\u5F0F\u5927\u6A90\u5E3D\u5939\u5728\u81C2\u4E0B(\u975E\u624B\u6301\u9053\u5177\u65F6\u7701\u7565)"
  }, ["39-50", "51-65"]),
  c("div-job-male-vendor", "\u7537\u83DC\u8D29\u644A\u4E3B\u5957\u88C5", "male", ["modern", "rural"], ["\u644A\u4E3B", "\u83DC\u8D29", "\u5E02\u4E95", "\u52E4\u5FEB"], "\u51CC\u6668\u8FDB\u8D27\u7684\u52E4\u5FEB\u644A\u4E3B\u3002", {
    inner: "\u5706\u9886T\u6064, \u8896\u53E3\u5377\u8D77, \u9762\u6599\u88AB\u6C57\u6D78\u5F97\u53D1\u8F6F",
    top: "\u9632\u6C34\u56F4\u88D9\u7F69\u4F4F\u524D\u8EAB, \u7CFB\u5E26\u6253\u7ED3\u5728\u8170\u540E",
    bottom: "\u8010\u810F\u5DE5\u88C5\u88E4, \u88E4\u811A\u633D\u8D77",
    outerwear: "\u65E0",
    legwear: "\u539A\u68C9\u889C, \u889C\u7B52\u5377\u5728\u80F6\u978B\u53E3\u5916",
    shoes: "\u9632\u6C34\u80F6\u978B, \u978B\u5E2E\u6CBE\u7740\u83DC\u53F6\u4E0E\u6C34\u6E0D",
    accessory: "\u96F6\u94B1\u8170\u5305\u659C\u630E\u5728\u80EF\u524D, \u62C9\u94FE\u5E38\u5E74\u534A\u5F00"
  }, ["29-38", "39-50", "51-65"]),
  c("div-job-male-lawyer-street", "\u7537\u57FA\u5C42\u6CD5\u5F8B\u5DE5\u4F5C\u8005\u5957\u88C5", "male", ["modern", "career"], ["\u6CD5\u5F8B", "\u57FA\u5C42", "\u6734\u5B9E", "\u4E25\u8C28"], "\u8DD1\u57FA\u5C42\u7684\u6CD5\u5F8B\u5DE5\u4F5C\u8005, \u897F\u88C5\u4F46\u4E0D\u7CBE\u82F1\u3002", {
    inner: "\u514D\u70EB\u886C\u886B, \u9886\u53E3\u5FAE\u65E7",
    top: "\u7248\u578B\u5BBD\u677E\u7684\u5355\u6392\u6263\u897F\u88C5, \u9762\u6599\u8010\u7A7F",
    bottom: "\u540C\u8272\u7CFB\u897F\u88E4, \u819D\u90E8\u7565\u6709\u7A7F\u7740\u75D5\u8FF9",
    outerwear: "\u897F\u88C5\u5373\u5916\u5C42",
    legwear: "\u6DF1\u7D20\u8272\u889C",
    shoes: "\u5706\u5934\u7CFB\u5E26\u76AE\u978B, \u978B\u8DDF\u78E8\u635F",
    accessory: "\u516C\u6587\u5305\u63D0\u5728\u624B\u4FA7(\u975E\u624B\u6301\u9053\u5177\u65F6\u7701\u7565)"
  }, ["29-38", "39-50"]),
  c("div-job-female-nurse-scrub", "\u5973\u62A4\u58EB\u6D17\u624B\u670D\u5957\u88C5", "female", ["modern"], ["\u62A4\u58EB", "\u533B\u7597", "\u5236\u670D", "\u5229\u843D"], "\u75C5\u533A\u91CC\u811A\u6B65\u4E0D\u505C\u7684\u62A4\u58EB\u3002", {
    inner: "\u6D17\u624B\u670D\u672C\u4F53, \u9762\u6599\u5438\u6C57\u901F\u5E72, \u9886\u53E3\u5F00\u5408\u5229\u843D",
    top: "V\u9886\u77ED\u8896\u6D17\u624B\u670D\u4E0A\u8863, \u53CC\u4E0B\u888B",
    bottom: "\u540C\u6B3E\u76F4\u7B52\u6D17\u624B\u88E4, \u62BD\u7EF3\u675F\u8170, \u88E4\u811A\u4E0D\u62D6\u5730",
    outerwear: "\u65E0",
    legwear: "\u538B\u529B\u68C9\u889C, \u4E45\u7AD9\u9632\u80C0, \u889C\u53E3\u4E0D\u52D2",
    shoes: "\u8F6F\u5E95\u62A4\u58EB\u978B, \u978B\u5934\u5305\u88F9, \u8D70\u52A8\u51E0\u4E4E\u65E0\u58F0",
    accessory: "\u8868\u94FE\u5F0F\u80F8\u8868\u522B\u5728\u80F8\u524D, \u53E3\u888B\u63D2\u7740\u7B14\u4E0E\u5C0F\u624B\u7535"
  }, ["21-28", "29-38", "39-50"]),
  c("div-job-female-caregiver", "\u5973\u62A4\u5DE5\u5229\u843D\u5957\u88C5", "female", ["modern"], ["\u62A4\u5DE5", "\u7167\u62A4", "\u8010\u5FC3", "\u5229\u843D"], "\u533B\u9662\u966A\u62A4\u95F4\u9699\u9760\u5899\u6B47\u811A\u7684\u62A4\u5DE5\u3002", {
    inner: "\u5706\u9886\u68C9T\u6064, \u9762\u6599\u5438\u6C57, \u9886\u53E3\u4E0D\u52D2\u8116",
    top: "\u62A4\u5DE5\u7F69\u8863\u9A6C\u7532, \u5927\u53E3\u888B, \u4FA7\u7CFB\u5E26",
    bottom: "\u5F39\u6027\u76F4\u7B52\u88E4, \u8170\u5934\u5BBD\u677E, \u5F2F\u8170\u4E0D\u52D2",
    outerwear: "\u7F69\u8863\u5373\u5916\u5C42",
    legwear: "\u539A\u68C9\u77ED\u889C, \u4E45\u7AD9\u4E0D\u78E8\u811A\u8DDF",
    shoes: "\u9632\u6ED1\u8F6F\u5E95\u978B, \u978B\u5E2E\u4F4E, \u8D70\u5ECA\u5FEB\u8D70\u65E0\u58F0",
    accessory: "\u8896\u5957\u4E00\u5BF9, \u677E\u7D27\u53E3\u6536\u5728\u5C0F\u81C2, \u53E3\u888B\u522B\u7740\u8BB0\u4E8B\u5C0F\u672C"
  }, ["39-50", "51-65"]),
  c("div-job-female-teacher-dress", "\u5973\u6559\u5E08\u8FDE\u8863\u88D9\u5957\u88C5", "female", ["modern", "campus"], ["\u6559\u5E08", "\u4EB2\u548C", "\u8BB2\u53F0", "\u7AEF\u5E84"], "\u7C89\u7B14\u7070\u91CC\u4E5F\u7AEF\u5E84\u7684\u5973\u6559\u5E08\u3002", {
    inner: "\u8FDE\u8863\u88D9\u672C\u4F53, \u9762\u6599\u633A\u62EC\u4E0D\u900F, \u80A9\u7EBF\u670D\u5E16",
    top: "\u53CA\u819D\u886C\u886B\u5F0F\u8FDE\u8863\u88D9, \u7FFB\u9886\u7CFB\u6263, \u8170\u5E26\u540C\u6599",
    bottom: "\u88D9\u88C5\u8FDE\u4F53, \u53CA\u819D\u957F\u5EA6, \u8D70\u52A8\u65F6\u88D9\u6446\u5FAE\u6446",
    outerwear: "\u8584\u9488\u7EC7\u5F00\u886B, \u677E\u677E\u642D\u5728\u80A9\u4E0A, \u8896\u53E3\u7F57\u7EB9\u6536\u8FB9",
    legwear: "\u80A4\u8272\u8584\u889C, \u8D28\u5730\u8F7B\u900F, \u6536\u5728\u978B\u53E3\u5185",
    shoes: "\u4F4E\u8DDF\u5C16\u5934\u5355\u978B, \u978B\u8DDF\u7A33, \u8BB2\u53F0\u4E0A\u4E45\u7AD9\u4E0D\u6643",
    accessory: "\u7B80\u6D01\u8155\u8868, \u8868\u5E26\u7EC6\u7A84, \u624B\u8FB9\u5E38\u63E1\u4E00\u652F\u677F\u64E6"
  }, ["21-28", "29-38", "39-50"]),
  c("div-job-female-streamer", "\u5973\u4E3B\u64AD\u4E0A\u955C\u5957\u88C5", "female", ["modern"], ["\u4E3B\u64AD", "\u4E0A\u955C", "\u7CBE\u81F4", "\u7F51\u611F"], "\u8865\u5149\u706F\u524D\u7684\u7CBE\u81F4\u5973\u4E3B\u64AD\u3002", {
    inner: "\u7F0E\u9762\u540A\u5E26\u6253\u5E95, \u9762\u6599\u5782\u987A, \u4E0A\u955C\u6709\u5149\u6CFD",
    top: "\u77ED\u6B3E\u6CE1\u6CE1\u8896\u4E0A\u8863, \u65B9\u9886, \u6536\u8170",
    bottom: "\u9AD8\u8170\u76F4\u7B52\u897F\u88E4\u62C9\u957F\u6BD4\u4F8B, \u88E4\u7EBF\u7B14\u633A",
    outerwear: "\u65E0",
    legwear: "\u80A4\u8272\u9690\u5F62\u889C, \u5B8C\u5168\u85CF\u5728\u978B\u53E3\u5185",
    shoes: "\u5C16\u5934\u7EC6\u8DDF\u5355\u978B, \u978B\u8DDF\u7A33, \u4E45\u5750\u4E0D\u6362\u978B",
    accessory: "\u7CBE\u81F4\u8033\u73AF, \u4E0A\u955C\u611F\u5F3A, \u8033\u540E\u5939\u7740\u6536\u97F3\u9EA6\u7EBF"
  }, ["21-28", "29-38"]),
  c("div-job-female-housekeeper", "\u5973\u5BB6\u653F\u963F\u59E8\u5957\u88C5", "female", ["modern"], ["\u5BB6\u653F", "\u963F\u59E8", "\u52E4\u5FEB", "\u6574\u6D01"], "\u624B\u811A\u9EBB\u5229\u7684\u5BB6\u653F\u963F\u59E8\u3002", {
    inner: "\u5706\u9886\u7EAF\u68C9T\u6064, \u9886\u53E3\u6D17\u5F97\u53D1\u8F6F, \u4E0B\u6446\u6396\u8FDB\u88E4\u8170",
    top: "\u5BB6\u653F\u56F4\u88D9\u80CC\u5E26\u5F0F, \u524D\u888B\u63D2\u7740\u62B9\u5E03\u4E00\u89D2",
    bottom: "\u5F39\u6027\u76F4\u7B52\u957F\u88E4, \u819D\u5934\u5FAE\u5FAE\u8D77\u5305, \u4FBF\u4E8E\u8E72\u8DEA\u64E6\u6D17",
    outerwear: "\u65E0",
    legwear: "\u539A\u68C9\u77ED\u889C, \u889C\u53E3\u677E\u5F1B\u5806\u5728\u811A\u8E1D",
    shoes: "\u9632\u6ED1\u5E73\u5E95\u8F6F\u978B, \u978B\u5934\u5706\u6DA6, \u978B\u4FA7\u7559\u7740\u6C34\u6E0D\u75D5",
    accessory: "\u5934\u5DFE\u5305\u4F4F\u53D1\u9AFB, \u8FB9\u89D2\u6396\u7D27, \u624B\u8155\u5957\u7740\u6A61\u76AE\u7B4B"
  }, ["39-50", "51-65"]),
  c("div-job-female-shop-owner", "\u5973\u5C0F\u5E97\u8001\u677F\u5A18\u5957\u88C5", "female", ["modern"], ["\u8001\u677F\u5A18", "\u7CBE\u660E", "\u5E02\u4E95", "\u723D\u5229"], "\u7B97\u8D26\u98DE\u5FEB\u7684\u723D\u5229\u8001\u677F\u5A18\u3002", {
    inner: "\u4FEE\u8EAB\u9AD8\u9886\u6253\u5E95, \u9762\u6599\u7EC6\u817B\u8D34\u8EAB, \u9886\u53E3\u7FFB\u6298\u5229\u843D",
    top: "\u77ED\u6B3E\u6536\u8170\u5939\u68C9\u5916\u5957, \u76D8\u6263\u70B9\u7F00",
    bottom: "\u76F4\u7B52\u4E5D\u5206\u88E4, \u88E4\u7EBF\u633A\u62EC, \u9732\u51FA\u811A\u8E1D",
    outerwear: "\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u7EC6\u68C9\u77ED\u889C, \u9690\u5728\u978B\u53E3\u4E0D\u5916\u9732",
    shoes: "\u5E73\u5E95\u4E50\u798F\u978B, \u978B\u9762\u8F6F, \u7AD9\u67DC\u53F0\u4E00\u5929\u4E0D\u7D2F",
    accessory: "\u7EC6\u624B\u956F\u4E00\u5BF9, \u8155\u95F4\u76F8\u78B0\u6709\u8F7B\u54CD, \u8033\u540E\u5939\u4E00\u652F\u8BB0\u8D26\u7B14"
  }, ["29-38", "39-50"]),
  c("div-job-female-hr-office", "\u5973\u884C\u653F\u901A\u52E4\u5957\u88C5", "female", ["modern", "career"], ["\u884C\u653F", "HR", "\u901A\u52E4", "\u5F97\u4F53"], "\u5199\u5B57\u697C\u91CC\u5F97\u4F53\u4E0D\u5F20\u626C\u7684\u884C\u653F\u3002", {
    inner: "\u771F\u4E1D\u8D28\u611F\u886C\u886B, \u9886\u53E3\u7CFB\u5C0F\u98D8\u5E26",
    top: "\u77ED\u6B3E\u5706\u9886\u5C0F\u5916\u5957, \u65E0\u9886\u8BBE\u8BA1",
    bottom: "\u53CA\u819D\u94C5\u7B14\u88D9, \u526A\u88C1\u8D34\u5408, \u540E\u5F00\u8869\u4FBF\u4E8E\u8D70\u52A8",
    outerwear: "\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u80A4\u8272\u4E1D\u889C, \u8D28\u5730\u7EC6\u817B\u65E0\u8DF3\u4E1D",
    shoes: "\u4E2D\u8DDF\u5C16\u5934\u5355\u978B, \u978B\u8DDF\u5305\u88F9, \u8D70\u5ECA\u91CC\u58F0\u54CD\u514B\u5236",
    accessory: "\u73CD\u73E0\u5355\u9897\u8033\u9489, \u624B\u8FB9\u5E38\u5939\u4E00\u53EA\u6587\u4EF6\u5939"
  }, ["21-28", "29-38"]),
  // ================= 乡村 / 年代 / 季节 =================
  c("div-rural-male-sheepskin", "\u7537\u5317\u65B9\u8001\u519C\u51AC\u88C5\u5957\u88C5", "male", ["rural"], ["\u8001\u519C", "\u5317\u65B9", "\u51AC\u88C5", "\u6CA7\u6851"], "\u5317\u65B9\u6751\u53E3\u7684\u8001\u519C, \u51AC\u8863\u539A\u5B9E\u5E26\u98CE\u971C\u3002", {
    inner: "\u9AD8\u9886\u7C97\u6BDB\u8863, \u8D77\u7403\u81EA\u7136",
    top: "\u4EFF\u7F8A\u76AE\u5939\u68C9\u5916\u5957, \u7FFB\u6BDB\u9886, \u8896\u53E3\u78E8\u4EAE",
    bottom: "\u52A0\u68C9\u76F4\u7B52\u88E4, \u819D\u90E8\u9F13\u5305",
    outerwear: "\u5916\u5957\u5373\u5916\u5C42",
    legwear: "\u7C97\u7EBF\u539A\u889C",
    shoes: "\u5927\u5934\u68C9\u978B",
    accessory: "\u70DF\u888B\u522B\u5728\u8170\u540E(\u975E\u624B\u6301\u9053\u5177\u65F6\u7701\u7565)"
  }, ["51-65", "66-80"]),
  c("div-rural-female-headscarf", "\u5973\u5317\u65B9\u519C\u5987\u5934\u5DFE\u5957\u88C5", "female", ["rural"], ["\u519C\u5987", "\u5317\u65B9", "\u52E4\u52B3", "\u98CE\u971C"], "\u7076\u53F0\u4E0E\u7530\u57C2\u4E4B\u95F4\u7684\u5317\u65B9\u519C\u5987\u3002", {
    inner: "\u788E\u82B1\u68C9\u8884\u5185\u886C, \u9762\u6599\u8F6F\u584C, \u9886\u53E3\u8D34\u9888\u4FDD\u6696",
    top: "\u5939\u68C9\u7F69\u8863, \u659C\u895F\u5E03\u6263",
    bottom: "\u76F4\u7B52\u68C9\u88E4, \u88E4\u8170\u677E\u7D27, \u88E4\u811A\u624E\u8FDB\u889C\u53E3",
    outerwear: "\u7F69\u8863\u5373\u5916\u5C42",
    legwear: "\u7C97\u68C9\u539A\u889C, \u889C\u7B52\u5BBD\u677E\u5806\u5728\u8E1D\u4E0A",
    shoes: "\u68C9\u5E03\u978B, \u978B\u5E95\u7EB3\u5F97\u539A\u5B9E, \u978B\u9762\u6CBE\u7740\u571F",
    accessory: "\u65B9\u5934\u5DFE\u5305\u53D1\u5728\u8111\u540E\u6253\u7ED3, \u8FB9\u89D2\u6396\u8FDB\u8863\u9886"
  }, ["39-50", "51-65", "66-80"]),
  c("div-rural-male-fisherman", "\u7537\u6E14\u6C11\u80F6\u8863\u5957\u88C5", "male", ["rural"], ["\u6E14\u6C11", "\u6D77\u8FB9", "\u98CE\u6D6A", "\u7C97\u7C9D"], "\u6D77\u98CE\u5439\u76B1\u76AE\u80A4\u7684\u8001\u6E14\u6C11\u3002", {
    inner: "\u7C97\u9488\u6BDB\u8863, \u9AD8\u9886\u6321\u98CE, \u7EC7\u7EB9\u7C97\u5927\u8D77\u7403",
    top: "\u9632\u6C34\u80F6\u8D28\u80CC\u5E26\u5DE5\u4F5C\u670D, \u80CC\u5E26\u5BBD\u539A",
    bottom: "\u80CC\u5E26\u88E4\u8FDE\u4F53, \u88E4\u7BA1\u5BBD\u539A, \u4FBF\u4E8E\u5957\u8FDB\u9774\u7B52",
    outerwear: "\u77ED\u6B3E\u9632\u98CE\u5916\u5957\u655E\u7A7F",
    legwear: "\u539A\u6BDB\u7EBF\u889C, \u889C\u7B52\u5377\u5728\u9774\u53E3\u5916",
    shoes: "\u9AD8\u7B52\u80F6\u9774, \u9774\u9762\u6302\u7740\u76D0\u6E0D, \u9774\u53E3\u7FFB\u6298",
    accessory: "\u65E7\u6BDB\u7EBF\u5E3D\u538B\u5230\u7709\u9AA8, \u5E3D\u6A90\u8D77\u7403"
  }, ["39-50", "51-65"]),
  c("div-rural-female-tea-picker", "\u5973\u91C7\u8336\u519C\u5987\u5957\u88C5", "female", ["rural"], ["\u8336\u519C", "\u5C71\u95F4", "\u52E4\u52B3", "\u6E05\u6668"], "\u6668\u96FE\u8336\u5C71\u95F4\u7684\u91C7\u8336\u5973\u3002", {
    inner: "\u5706\u9886\u68C9\u886B",
    top: "\u659C\u895F\u5E03\u886B, \u8896\u53E3\u6536\u7D27\u9632\u9732\u6C34",
    bottom: "\u76F4\u7B52\u5E03\u88E4, \u88E4\u811A\u624E\u8FDB\u889C\u53E3",
    outerwear: "\u65E0",
    legwear: "\u68C9\u5E03\u957F\u889C",
    shoes: "\u9632\u6ED1\u80F6\u5E95\u5E03\u978B",
    accessory: "\u6597\u7B20\u80CC\u5728\u80CC\u540E, \u7AF9\u7BD3\u659C\u630E(\u975E\u624B\u6301\u9053\u5177\u65F6\u7701\u7565)"
  }, ["29-38", "39-50", "51-65"]),
  c("div-period-male-80s-worker", "\u7537\u516B\u5341\u5E74\u4EE3\u804C\u5DE5\u5957\u88C5", "male", ["period"], ["\u5E74\u4EE3", "\u804C\u5DE5", "\u6734\u5B9E", "\u6000\u65E7"], "\u516B\u5341\u5E74\u4EE3\u5DE5\u5382\u4E0B\u73ED\u8DEF\u4E0A\u7684\u804C\u5DE5\u3002", {
    inner: "\u6C57\u886B\u9886\u53E3\u9732\u51FA\u4E00\u7EBF",
    top: "\u7684\u786E\u826F\u886C\u886B\u585E\u8FDB\u88E4\u8170",
    bottom: "\u9AD8\u8170\u76F4\u7B52\u897F\u88E4, \u76AE\u5E26\u52D2\u51FA\u88E4\u8936",
    outerwear: "\u6DA4\u5361\u5916\u5957\u642D\u5728\u80A9\u4E0A(\u7A7F\u7740\u65F6\u4E3A\u5916\u5C42)",
    legwear: "\u5C3C\u9F99\u889C",
    shoes: "\u5851\u5E95\u51C9\u76AE\u978B",
    accessory: "\u4E0A\u8863\u888B\u522B\u94A2\u7B14, \u624B\u8155\u65E7\u673A\u68B0\u8868"
  }, ["29-38", "39-50"]),
  c("div-period-female-80s-bride", "\u5973\u5E74\u4EE3\u788E\u82B1\u68C9\u8884\u5957\u88C5", "female", ["period", "rural"], ["\u5E74\u4EE3", "\u65B0\u5AB3\u5987", "\u788E\u82B1", "\u6000\u65E7"], "\u5E74\u4EE3\u5267\u91CC\u7684\u65B0\u5AB3\u5987, \u788E\u82B1\u68C9\u8884\u6620\u886C\u65B0\u5AC1\u6C14\u8272\u3002", {
    inner: "\u68C9\u6BDB\u886B\u6253\u5E95, \u9886\u53E3\u8D34\u9888, \u9762\u6599\u539A\u5B9E",
    top: "\u788E\u82B1\u5939\u68C9\u8884, \u659C\u895F\u5E03\u6263, \u8896\u53E3\u6EDA\u8FB9",
    bottom: "\u76F4\u7B52\u68C9\u88E4, \u88E4\u7BA1\u633A\u62EC, \u88E4\u811A\u538B\u4F4F\u978B\u9762",
    outerwear: "\u68C9\u8884\u5373\u5916\u5C42",
    legwear: "\u7C97\u68C9\u889C, \u889C\u7B52\u5806\u5728\u811A\u8E1D",
    shoes: "\u5706\u5934\u7CFB\u5E26\u76AE\u978B, \u978B\u9762\u64E6\u5F97\u53D1\u4EAE",
    accessory: "\u4E24\u6761\u9EBB\u82B1\u8FAB\u5782\u5728\u80F8\u524D, \u8FAB\u68A2\u7CFB\u7EF8\u5E26"
  }, ["21-28", "29-38"]),
  c("div-period-male-republican-changpao", "\u7537\u6C11\u56FD\u957F\u886B\u5148\u751F\u5957\u88C5", "male", ["republican"], ["\u5148\u751F", "\u6587\u4EBA", "\u957F\u886B", "\u65AF\u6587"], "\u6C11\u56FD\u6559\u4E66\u5148\u751F, \u957F\u886B\u4E00\u88AD\u4E66\u5377\u6EE1\u8EAB\u3002", {
    inner: "\u7ACB\u9886\u5185\u886B",
    top: "\u7D20\u9762\u957F\u886B\u53CA\u8E1D, \u7ACB\u9886\u76D8\u6263, \u4FA7\u5F00\u8869",
    bottom: "\u76F4\u7B52\u957F\u88E4\u9690\u5728\u886B\u4E0B",
    outerwear: "\u65E0",
    legwear: "\u68C9\u7EBF\u957F\u889C, \u889C\u7B52\u6536\u5728\u88E4\u811A\u5185",
    shoes: "\u5706\u53E3\u5E03\u978B, \u978B\u9762\u7D20\u51C0, \u978B\u5E95\u7EB3\u5F97\u539A",
    accessory: "\u7EBF\u88C5\u4E66\u5939\u81C2\u4E0B(\u975E\u624B\u6301\u9053\u5177\u65F6\u7701\u7565)"
  }, ["29-38", "39-50", "51-65"]),
  c("div-period-female-republican-student", "\u5973\u6C11\u56FD\u5973\u5B66\u751F\u5957\u88C5", "female", ["republican"], ["\u5973\u5B66\u751F", "\u6C11\u56FD", "\u6E05\u4E3D", "\u4E66\u5377"], "\u6C11\u56FD\u5973\u5B66\u751F, \u5012\u5927\u8896\u4E0A\u8863\u914D\u957F\u88D9\u3002", {
    inner: "\u7ACB\u9886\u659C\u895F\u5012\u5927\u8896\u4E0A\u8863, \u7F18\u8FB9\u7EC6\u81F4",
    top: "\u4E0A\u8863\u5373\u4E3B\u5C42",
    bottom: "\u53CA\u8E1D\u7D20\u9762\u957F\u88D9, \u88D9\u8170\u9AD8\u675F",
    outerwear: "\u9488\u7EC7\u62AB\u80A9\u56F4\u62E2",
    legwear: "\u68C9\u7EBF\u957F\u889C, \u889C\u7B52\u8FC7\u819D, \u6536\u53E3\u5E73\u6574",
    shoes: "\u642D\u5E26\u76AE\u978B, \u978B\u8DDF\u4F4E\u5E73, \u978B\u9762\u64E6\u5F97\u5E72\u51C0",
    accessory: "\u9F50\u8033\u77ED\u53D1\u522B\u4E00\u679A\u7EC6\u53D1\u5939"
  }, ["16-20", "21-28"]),
  c("div-winter-male-parka", "\u7537\u5BD2\u51AC\u6D3E\u514B\u5927\u8863\u5957\u88C5", "male", ["modern"], ["\u51AC\u88C5", "\u901A\u52E4", "\u5FA1\u5BD2", "\u633A\u62EC"], "\u5BD2\u6F6E\u5929\u4E5F\u4F53\u9762\u7684\u901A\u52E4\u7537\u6027\u3002", {
    inner: "\u9AD8\u9886\u7F8A\u6BDB\u886B, \u7EC7\u7EB9\u7D27\u5BC6, \u9886\u53E3\u7FFB\u6298\u4E24\u9053",
    top: "\u53CA\u819D\u6D3E\u514B\u5927\u8863, \u8FDE\u5E3D\u6BDB\u8FB9, \u5927\u8D34\u888B",
    bottom: "\u539A\u76F4\u7B52\u4F11\u95F2\u88E4, \u9762\u6599\u633A\u62EC, \u88E4\u811A\u538B\u4F4F\u9774\u7B52",
    outerwear: "\u5927\u8863\u5373\u5916\u5C42",
    legwear: "\u7F8A\u6BDB\u539A\u889C, \u889C\u7B52\u8FC7\u8E1D, \u585E\u8FDB\u9774\u53E3",
    shoes: "\u9632\u6ED1\u77ED\u9774, \u978B\u5E95\u9F7F\u7EB9\u6DF1, \u978B\u5E2E\u5305\u4F4F\u811A\u8E1D",
    accessory: "\u9488\u7EC7\u56F4\u5DFE\u7ED5\u4E24\u5708, \u5C3E\u7AEF\u585E\u8FDB\u5927\u8863\u9886\u53E3"
  }, ["21-28", "29-38", "39-50"]),
  c("div-winter-female-long-down", "\u5973\u957F\u6B3E\u7FBD\u7ED2\u670D\u5957\u88C5", "female", ["modern"], ["\u51AC\u88C5", "\u5FA1\u5BD2", "\u65E5\u5E38", "\u84EC\u677E"], "\u88F9\u6210\u6E29\u6696\u4E00\u56E2\u7684\u8FC7\u51AC\u65E5\u5E38\u3002", {
    inner: "\u9AD8\u9886\u6253\u5E95\u886B, \u9762\u6599\u8D34\u8EAB\u4FDD\u6696, \u9886\u53E3\u7FFB\u6298",
    top: "\u53CA\u8E1D\u957F\u6B3E\u7FBD\u7ED2\u670D, \u7ED7\u7F1D\u6A2A\u7EB9, \u8FDE\u5E3D",
    bottom: "\u52A0\u7ED2\u76F4\u7B52\u88E4, \u88E4\u7BA1\u633A\u62EC, \u88E4\u811A\u538B\u4F4F\u9774\u53E3",
    outerwear: "\u7FBD\u7ED2\u670D\u5373\u5916\u5C42",
    legwear: "\u52A0\u539A\u957F\u889C, \u889C\u7B52\u8FC7\u5C0F\u817F, \u585E\u8FDB\u9774\u5185",
    shoes: "\u96EA\u5730\u77ED\u9774, \u9632\u6ED1\u9F7F\u5E95, \u9774\u53E3\u4E00\u5708\u7ED2\u8FB9",
    accessory: "\u6BDB\u7EBF\u5E3D\u5E26\u7ED2\u7403, \u5E3D\u6A90\u538B\u4F4F\u7709\u9AA8"
  }, ["16-20", "21-28", "29-38", "39-50"]),
  c("div-summer-male-vest-uncle", "\u7537\u76DB\u590F\u5927\u7237\u80CC\u5FC3\u5957\u88C5", "male", ["modern", "rural"], ["\u5927\u7237", "\u76DB\u590F", "\u5E02\u4E95", "\u4E58\u51C9"], "\u6811\u836B\u4E0B\u6447\u6247\u4E58\u51C9\u7684\u5927\u7237\u3002", {
    inner: "\u7EAF\u68C9\u80CC\u5FC3\u4E3A\u4E3B\u5C42, \u9886\u53E3\u5BBD\u677E, \u4E0B\u6446\u6396\u8FDB\u88E4\u8170",
    top: "\u65E0",
    bottom: "\u8FC7\u819D\u5BBD\u677E\u77ED\u88E4, \u88E4\u7BA1\u80A5\u5927, \u8D70\u52A8\u5E26\u98CE",
    outerwear: "\u65E0",
    legwear: "\u8239\u889C\u6216\u5149\u811A\u7A7F\u978B, \u811A\u80CC\u6652\u51FA\u978B\u5E26\u75D5",
    shoes: "\u5851\u6599\u51C9\u62D6, \u978B\u5E95\u88AB\u8E29\u51FA\u811A\u5F62",
    accessory: "\u84B2\u6247\u968F\u624B\u6447\u7740, \u8116\u6302\u6BDB\u5DFE\u64E6\u6C57"
  }, ["51-65", "66-80"]),
  c("div-summer-female-icecream", "\u5973\u76DB\u590F\u6E05\u51C9\u5957\u88C5", "female", ["modern"], ["\u590F\u65E5", "\u6E05\u51C9", "\u8F7B\u5FEB", "\u65E5\u5E38"], "\u4E09\u4F0F\u5929\u91CC\u7684\u8F7B\u5FEB\u7A7F\u642D\u3002", {
    inner: "\u80CC\u5FC3\u5F0F\u9488\u7EC7\u4E0A\u8863, \u5706\u9886, \u7EC7\u7EB9\u758F\u900F\u6C14",
    top: "\u9632\u6652\u8584\u5F00\u886B\u968F\u624B\u62AB\u7740",
    bottom: "\u9AD8\u8170\u9614\u817F\u8584\u957F\u88E4, \u9762\u6599\u5782\u5760",
    outerwear: "\u5F00\u886B\u5373\u5916\u5C42",
    legwear: "\u8F7B\u8584\u8239\u889C, \u85CF\u5728\u978B\u53E3\u4E0D\u5916\u9732",
    shoes: "\u4E00\u5B57\u5E26\u51C9\u978B, \u978B\u5E95\u5E73\u8584, \u811A\u80CC\u9732\u51FA\u5927\u534A",
    accessory: "\u8F7B\u4FBF\u5E03\u5E3D, \u5E3D\u6A90\u8F6F\u584C, \u53EF\u968F\u624B\u5377\u8D77\u585E\u5305"
  }, ["16-20", "21-28", "29-38"])
];

// services/characterStylingWardrobeCapsulesWorlds.ts
var slot4 = (detail, material) => ({
  label: detail.replace(/[，,].*$/, ""),
  material: material || detail,
  detail
});
var c2 = (id, label, gender, eras, roleTags, summary, slots3, ageBands) => ({
  id,
  label,
  gender,
  eras,
  roleTags,
  summary,
  ageBands,
  slots: Object.fromEntries(
    Object.entries(slots3).map(([key, detail]) => [key, slot4(detail)])
  )
});
var WORLD_WARDROBE_CAPSULES = [
  // ================= 中式古装(ancient) =================
  c2("wld-anc-male-scholar", "\u5BD2\u95E8\u4E66\u751F\u76F4\u88F0", "male", ["ancient"], ["\u4E66\u751F", "\u5BD2\u95E8", "\u4E3E\u5B50", "\u6587\u5F31", "\u53E4\u88C5"], "\u6E05\u8D2B\u8BFB\u4E66\u4EBA, \u8863\u6599\u7D20\u6734\u4F46\u6D46\u6D17\u9F50\u6574, \u9760\u4EEA\u6001\u800C\u975E\u7528\u6599\u7ACB\u4F4F\u4F53\u9762\u3002", {
    inner: "\u4EA4\u9886\u4E2D\u8863, \u7D20\u68C9, \u9886\u7F18\u7A84",
    top: "\u4EA4\u9886\u76F4\u88F0, \u5E7F\u8896, \u8170\u95F4\u65E0\u534E\u9970, \u4E0B\u6446\u8FC7\u819D",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u88E4\u811A\u675F\u8FDB\u884C\u7E22",
    outerwear: "\u5355\u5C42\u8584\u7F69\u886B, \u6D17\u81F3\u8F6F\u584C, \u80A9\u7F1D\u6709\u8865\u7EBF",
    legwear: "\u68C9\u5E03\u7F57\u889C, \u889C\u53E3\u7565\u677E",
    shoes: "\u5E03\u9762\u8F6F\u5C65, \u5343\u5C42\u5E95, \u978B\u5934\u78E8\u51FA\u6BDB\u8FB9",
    accessory: "\u5E03\u5236\u65B9\u5DFE\u675F\u53D1, \u8170\u4FA7\u60AC\u4E00\u679A\u7D20\u6728\u4E66\u7BA7\u6263"
  }, ["16-20", "21-28"]),
  c2("wld-anc-male-noble-youth", "\u4E16\u5BB6\u516C\u5B50\u9526\u888D", "male", ["ancient"], ["\u516C\u5B50", "\u4E16\u5BB6", "\u8D35\u80C4", "\u98CE\u6D41", "\u53E4\u88C5"], "\u949F\u9E23\u9F0E\u98DF\u4E4B\u5BB6\u7684\u5C11\u7237, \u7528\u6599\u8003\u7A76\u3001\u7EB9\u6837\u7E41\u5BC6, \u4E3E\u624B\u6295\u8DB3\u5E26\u517B\u51FA\u6765\u7684\u677E\u5F1B\u3002", {
    inner: "\u7EC6\u7EB1\u4E2D\u5355, \u9886\u53E3\u538B\u6697\u7EB9",
    top: "\u5706\u9886\u888D, \u7F0E\u9762\u6697\u63D0\u82B1, \u80A9\u80CC\u5904\u7EB9\u6837\u5BF9\u79F0",
    bottom: "\u540C\u6599\u5408\u88C6\u957F\u88E4, \u88E4\u7EBF\u7B14\u633A",
    outerwear: "\u5BF9\u895F\u5927\u8896\u886B, \u9886\u7F18\u4E0E\u8896\u7F18\u53E6\u63A5\u7F02\u4E1D\u7A84\u8FB9",
    legwear: "\u7EC6\u845B\u7F57\u889C",
    shoes: "\u539A\u5E95\u7FD8\u5934\u9774, \u9774\u9762\u538B\u4E91\u7EB9",
    accessory: "\u7389\u5E26\u94A9\u675F\u9769\u5E26, \u8170\u4FA7\u5782\u4E00\u679A\u96D5\u87AD\u73AF\u4F69"
  }, ["21-28", "29-38"]),
  c2("wld-anc-male-young-general", "\u5C11\u5E74\u5C06\u519B\u8F7B\u7532", "male", ["ancient"], ["\u5C06\u519B", "\u5C11\u5E74", "\u6B66\u5C06", "\u82F1\u6C14", "\u53E4\u88C5"], "\u521D\u638C\u5175\u6743\u7684\u5E74\u8F7B\u6B66\u5C06, \u8F7B\u7532\u4FBF\u4E8E\u9A91\u5C04, \u7532\u7247\u65B0\u4EAE\u65E0\u6218\u635F\u3002", {
    inner: "\u7A84\u8896\u52B2\u88C5\u5185\u886C, \u6536\u8155",
    top: "\u76AE\u8D28\u672D\u7532\u80CC\u5FC3, \u7532\u7247\u7EC6\u5BC6, \u80A9\u541E\u517D\u9996",
    bottom: "\u675F\u53E3\u6218\u88E4, \u819D\u90E8\u52A0\u7F1D\u62A4\u7247",
    outerwear: "\u77ED\u62AB\u98CE, \u5355\u80A9\u7CFB\u6263, \u4E0B\u6446\u53CA\u8170",
    legwear: "\u7F20\u817F\u884C\u7E22, \u6536\u5F97\u7D27\u5B9E",
    shoes: "\u7B52\u9774, \u9774\u7B52\u786C\u633A\u81F3\u5C0F\u817F\u4E2D\u6BB5",
    accessory: "\u675F\u53D1\u51A0\u914D\u957F\u7F28, \u8170\u4F69\u7BAD\u56CA"
  }, ["16-20", "21-28"]),
  c2("wld-anc-male-old-general", "\u8001\u5C06\u519B\u91CD\u94E0", "male", ["ancient"], ["\u8001\u5C06", "\u7EDF\u5E05", "\u6B66\u5C06", "\u6CA7\u6851", "\u53E4\u88C5"], "\u4E45\u7ECF\u6218\u9635\u7684\u8001\u5E05, \u94E0\u7532\u539A\u91CD\u5E26\u6218\u635F\u75D5, \u6C14\u573A\u538B\u8FC7\u7EB9\u9970\u3002", {
    inner: "\u539A\u68C9\u6218\u8884, \u9AD8\u7ACB\u9886",
    top: "\u6574\u5E45\u9C7C\u9CDE\u94E0, \u80F8\u80CC\u53CC\u62A4\u5FC3\u955C, \u7532\u7F18\u78E8\u635F",
    bottom: "\u91CD\u7532\u6218\u88D9, \u5206\u7247\u5782\u5760, \u8FB9\u7F18\u5377\u53E3",
    outerwear: "\u957F\u6C05, \u6BDB\u9886\u539A\u5B9E, \u4E0B\u6446\u53CA\u8E1D",
    legwear: "\u539A\u7ED2\u62A4\u817F, \u5916\u675F\u76AE\u624E",
    shoes: "\u94C1\u5934\u6218\u9774, \u9774\u5E95\u9489\u638C",
    accessory: "\u515C\u936A\u7F6E\u4E8E\u81C2\u5F2F\u6216\u60AC\u4E8E\u978D\u4FA7, \u8170\u675F\u5BBD\u9769\u5E26"
  }, ["39-50", "51-65"]),
  c2("wld-anc-male-prince", "\u4EB2\u738B\u5E38\u670D", "male", ["ancient"], ["\u7687\u5B50", "\u738B\u7237", "\u5B97\u5BA4", "\u5A01\u4EEA", "\u53E4\u88C5"], "\u5B97\u5BA4\u65E5\u5E38\u8D77\u5C45\u7684\u5E38\u670D, \u5236\u5F0F\u89C4\u6574\u3001\u7EB9\u6837\u6709\u5B9A\u6570, \u4E0D\u5230\u5927\u671D\u4F1A\u4E0D\u7740\u793C\u670D\u3002", {
    inner: "\u7D20\u7F0E\u4E2D\u5355",
    top: "\u5706\u9886\u5E38\u670D\u888D, \u524D\u80F8\u540E\u80CC\u7F00\u65B9\u5F62\u8865\u5B50\u7EB9, \u8896\u53E3\u6536\u655B",
    bottom: "\u5408\u88C6\u957F\u88E4, \u4E0E\u888D\u540C\u6599",
    outerwear: "\u7F69\u7532\u5F0F\u534A\u81C2, \u5BF9\u895F\u65E0\u8896, \u8FB9\u7F18\u538B\u7EC7\u5E26",
    legwear: "\u7F0E\u9762\u957F\u889C",
    shoes: "\u671D\u9774, \u65B9\u5934\u539A\u5E95",
    accessory: "\u7389\u5E26\u4E00\u56F4, \u51A0\u5E3D\u7F00\u73E0\u4E00\u9897"
  }, ["21-28", "29-38"]),
  c2("wld-anc-male-chancellor", "\u91CD\u81E3\u671D\u670D", "male", ["ancient"], ["\u4E1E\u76F8", "\u6743\u81E3", "\u6587\u5B98", "\u57CE\u5E9C", "\u53E4\u88C5"], "\u4F4D\u6781\u4EBA\u81E3\u7684\u671D\u5802\u91CD\u81E3, \u670D\u5236\u6700\u9AD8\u4E00\u6863, \u7EB9\u6837\u4E0E\u4F69\u9970\u5168\u6309\u54C1\u7EA7\u6765\u3002", {
    inner: "\u7EC6\u845B\u4E2D\u8863",
    top: "\u5927\u8896\u671D\u888D, \u524D\u540E\u8865\u5B50\u7EC7\u79BD\u7EB9, \u8896\u5E45\u6781\u9614",
    bottom: "\u540C\u6599\u4E0B\u88F3, \u88FE\u957F\u66F3\u5730",
    outerwear: "\u5916\u62AB\u7F69\u888D, \u9886\u7F18\u7EC7\u56DE\u7EB9\u9614\u8FB9",
    legwear: "\u539A\u7F0E\u671D\u889C",
    shoes: "\u9AD8\u7B52\u671D\u9774, \u9774\u5E2E\u786C\u633A",
    accessory: "\u5C55\u811A\u5E5E\u5934, \u624B\u6301\u7B0F\u677F, \u8170\u675F\u7389\u5E26"
  }, ["39-50", "51-65"]),
  c2("wld-anc-male-eunuch", "\u5185\u4F8D\u603B\u7BA1\u670D", "male", ["ancient"], ["\u5185\u4F8D", "\u603B\u7BA1", "\u5BAB\u5EF7", "\u9634\u67D4", "\u53E4\u88C5"], "\u5BAB\u4E2D\u638C\u4E8B\u5185\u4F8D, \u8863\u6599\u7CBE\u7EC6\u4F46\u5F62\u5236\u523B\u610F\u6536\u655B, \u5904\u5904\u663E\u51FA\u4F8D\u5949\u8EAB\u4EFD\u3002", {
    inner: "\u7A84\u8896\u4E2D\u8863, \u8896\u53E3\u6263\u7D27",
    top: "\u8D34\u8EAB\u5706\u9886\u7A84\u8896\u888D, \u4E0B\u6446\u5F00\u8869\u6D45, \u4FBF\u4E8E\u5FEB\u6B65\u884C\u8D70",
    bottom: "\u7D27\u53E3\u957F\u88E4",
    outerwear: "\u5BF9\u895F\u6BD4\u7532, \u65E0\u8896, \u4E24\u4FA7\u5F00\u9AD8\u8869",
    legwear: "\u8F6F\u7F0E\u889C",
    shoes: "\u8F6F\u5E95\u5FEB\u9774, \u843D\u5730\u65E0\u58F0",
    accessory: "\u786C\u7FC5\u5C0F\u5E3D, \u8170\u95F4\u60AC\u4E00\u4E32\u94A5\u5319\u4E0E\u62C2\u5C18"
  }, ["29-38", "39-50", "51-65"]),
  c2("wld-anc-male-swordsman", "\u6C5F\u6E56\u4FA0\u5BA2\u52B2\u88C5", "male", ["ancient"], ["\u4FA0\u5BA2", "\u6C5F\u6E56", "\u5251\u5BA2", "\u4E0D\u7F81", "\u53E4\u88C5"], "\u5E38\u5E74\u5728\u5916\u7684\u6C5F\u6E56\u4EBA, \u4E00\u5207\u4E3A\u884C\u52A8\u670D\u52A1, \u8863\u6446\u77ED\u3001\u675F\u7F1A\u5C11\u3002", {
    inner: "\u7A84\u8896\u77ED\u886B, \u9886\u53E3\u655E\u5F00\u4E00\u5BF8",
    top: "\u4EA4\u9886\u52B2\u88C5\u4E0A\u8863, \u8170\u8EAB\u6536\u675F, \u4E0B\u6446\u4EC5\u53CA\u80EF",
    bottom: "\u675F\u53E3\u957F\u88E4, \u819D\u90E8\u52A0\u539A",
    outerwear: "\u534A\u65E7\u77ED\u6597\u7BF7, \u98CE\u5C18\u75D5\u660E\u663E, \u7CFB\u4E8E\u5355\u80A9",
    legwear: "\u7F20\u817F\u5E03\u5E26",
    shoes: "\u8584\u5E95\u5FEB\u9774, \u4FBF\u4E8E\u5954\u8DD1\u8DF3\u8DC3",
    accessory: "\u8170\u675F\u5BBD\u5E03\u5E26, \u675F\u53D1\u7528\u4E00\u6839\u6728\u7C2A, \u80CC\u8D1F\u5251\u9798"
  }, ["21-28", "29-38"]),
  c2("wld-anc-male-escort", "\u9556\u5E08\u884C\u88C5", "male", ["ancient"], ["\u9556\u5E08", "\u8D70\u9556", "\u6C5F\u6E56", "\u7C97\u8C6A", "\u53E4\u88C5"], "\u62BC\u9556\u8D70\u8FDC\u8DEF\u7684\u7C97\u8C6A\u6C49\u5B50, \u8863\u6599\u8010\u78E8, \u4E00\u8EAB\u5BB6\u4F19\u90FD\u6302\u5728\u8EAB\u4E0A\u3002", {
    inner: "\u7C97\u5E03\u5BF9\u895F\u6C57\u886B",
    top: "\u77ED\u6253\u4E0A\u8863, \u8896\u53E3\u7528\u5E03\u6761\u624E\u7D27, \u524D\u895F\u76D8\u6263\u5BC6\u6392",
    bottom: "\u80A5\u817F\u88E4, \u88E4\u811A\u624E\u5165\u9774\u7B52",
    outerwear: "\u539A\u5E03\u574E\u80A9, \u53CC\u80A9\u52A0\u7F1D\u8010\u78E8\u8865\u7247",
    legwear: "\u539A\u68C9\u62A4\u817F",
    shoes: "\u9AD8\u5E2E\u786C\u5E95\u9774, \u9774\u9762\u6CBE\u5C18",
    accessory: "\u5BBD\u76AE\u8170\u5E26\u6302\u9152\u846B\u82A6\u4E0E\u9556\u65D7\u675F"
  }, ["29-38", "39-50"]),
  c2("wld-anc-male-physician", "\u8D70\u65B9\u90CE\u4E2D", "male", ["ancient"], ["\u90CE\u4E2D", "\u5927\u592B", "\u533B\u8005", "\u6C89\u7A33", "\u53E4\u88C5"], "\u80CC\u836F\u7BB1\u8D70\u4E61\u4E32\u9547\u7684\u533B\u8005, \u8863\u7740\u6734\u7D20\u5E72\u51C0, \u8896\u53E3\u6C38\u8FDC\u633D\u8D77\u534A\u622A\u3002", {
    inner: "\u7D20\u4E2D\u8863, \u8896\u53E3\u7A84",
    top: "\u4EA4\u9886\u957F\u886B, \u8896\u53E3\u5E38\u633D\u81F3\u5C0F\u81C2, \u8863\u895F\u522B\u4E00\u6839\u7EC6\u9488\u56CA\u5E26",
    bottom: "\u76F4\u7B52\u5E03\u88E4",
    outerwear: "\u8584\u7F69\u8863, \u524D\u895F\u6709\u6D17\u4E0D\u6389\u7684\u836F\u6E0D",
    legwear: "\u68C9\u5E03\u889C",
    shoes: "\u539A\u5E95\u5E03\u978B, \u8D70\u8FDC\u8DEF\u78E8\u504F\u4E86\u978B\u8DDF",
    accessory: "\u80CC\u85E4\u7F16\u836F\u7BB1, \u8170\u60AC\u846B\u82A6"
  }, ["39-50", "51-65"]),
  c2("wld-anc-male-innkeeper", "\u5BA2\u6808\u638C\u67DC", "male", ["ancient"], ["\u638C\u67DC", "\u5E02\u4E95", "\u751F\u610F\u4EBA", "\u5706\u6ED1", "\u53E4\u88C5"], "\u524D\u5802\u540E\u53A8\u90FD\u8981\u7167\u5E94\u7684\u638C\u67DC, \u8863\u7740\u6574\u6D01\u5F97\u4F53, \u8896\u5957\u4E0E\u7B97\u76D8\u4E0D\u79BB\u8EAB\u3002", {
    inner: "\u7EC6\u5E03\u4E2D\u8863, \u9886\u53E3\u4EA4\u53E0\u5E73\u6574, \u8896\u53E3\u6536\u7A84",
    top: "\u4EA4\u9886\u957F\u886B, \u4E0B\u6446\u6396\u8FDB\u8170\u5E26\u4FBF\u4E8E\u8D70\u52A8",
    bottom: "\u5408\u88C6\u957F\u88E4, \u88E4\u7BA1\u5BBD\u677E, \u88E4\u811A\u624E\u8FDB\u889C\u53E3",
    outerwear: "\u77ED\u8902\u7F69\u886B, \u5BF9\u895F\u5E03\u6263",
    legwear: "\u68C9\u889C, \u889C\u7B52\u8FC7\u8E1D, \u6536\u5728\u978B\u53E3\u5185",
    shoes: "\u5E73\u5E95\u5E03\u978B, \u978B\u5E95\u7EB3\u5F97\u539A, \u524D\u5802\u540E\u53A8\u8D70\u5F97\u591A",
    accessory: "\u4E24\u53EA\u5E03\u8896\u5957, \u8170\u95F4\u522B\u7B97\u76D8\u4E0E\u8D26\u7C3F"
  }, ["39-50", "51-65"]),
  c2("wld-anc-male-constable", "\u6355\u5FEB\u516C\u670D", "male", ["ancient"], ["\u6355\u5FEB", "\u516C\u95E8", "\u8859\u5F79", "\u5E72\u7EC3", "\u53E4\u88C5"], "\u8859\u95E8\u5F53\u5DEE\u7684\u6355\u5FEB, \u516C\u670D\u5E26\u5236\u5F0F\u6807\u8BC6, \u5168\u8EAB\u914D\u7F6E\u4E3A\u8FFD\u6355\u8BBE\u8BA1\u3002", {
    inner: "\u7A84\u8896\u5185\u886C",
    top: "\u5706\u9886\u7A84\u8896\u516C\u670D, \u524D\u80F8\u7F00\u65B9\u5F62\u804C\u724C\u4F4D, \u8170\u8EAB\u6536\u675F",
    bottom: "\u675F\u53E3\u516C\u88E4",
    outerwear: "\u65E0\u8896\u7F69\u7532, \u4E24\u80A9\u7F00\u94DC\u9489\u4E00\u6392",
    legwear: "\u884C\u7E22\u7F20\u81F3\u819D\u4E0B",
    shoes: "\u5FEB\u9774, \u8584\u5E95\u5229\u4E8E\u75BE\u884C",
    accessory: "\u8170\u6302\u94C1\u5C3A\u4E0E\u9501\u94FE, \u5934\u6234\u5E73\u9876\u5E3D"
  }, ["21-28", "29-38", "39-50"]),
  c2("wld-anc-male-farmer", "\u7530\u95F4\u519C\u6237\u77ED\u6253", "male", ["ancient", "rural"], ["\u519C\u6237", "\u7530\u820D", "\u52B3\u4F5C", "\u61A8\u539A", "\u53E4\u88C5"], "\u7EC8\u5E74\u52B3\u4F5C\u7684\u5E84\u7A3C\u4EBA, \u8863\u670D\u77ED\u3001\u8010\u78E8\u3001\u5904\u5904\u662F\u8865\u4E01, \u5E72\u51C0\u4F46\u65E7\u3002", {
    inner: "\u7C97\u9EBB\u6C57\u886B, \u9886\u53E3\u6D17\u5F97\u53D1\u677E",
    top: "\u5BF9\u895F\u77ED\u8902, \u8896\u5B50\u633D\u5230\u8098\u4E0A, \u524D\u895F\u6570\u5904\u8865\u4E01",
    bottom: "\u53CA\u819D\u77ED\u88E4\u6216\u633D\u8D77\u7684\u957F\u88E4",
    outerwear: "\u84D1\u8863\u6216\u7C97\u5E03\u8902\u5B50, \u89C6\u5929\u6C14\u62AB\u6302",
    legwear: "\u7C97\u5E03\u7F20\u817F",
    shoes: "\u8349\u7F16\u51C9\u978B, \u978B\u5E95\u78E8\u8584",
    accessory: "\u6597\u7B20\u4E00\u9876, \u8170\u540E\u522B\u9570\u5200"
  }, ["39-50", "51-65", "66-80"]),
  c2("wld-anc-female-palace-maid", "\u5BAB\u5973\u5BAB\u88C5", "female", ["ancient"], ["\u5BAB\u5973", "\u5BAB\u5EF7", "\u4F8D\u5949", "\u62D8\u8C28", "\u53E4\u88C5"], "\u5185\u5EF7\u5F53\u503C\u7684\u5BAB\u5973, \u5236\u5F0F\u7EDF\u4E00\u3001\u7EB9\u6837\u6781\u7B80, \u9760\u53D1\u9970\u533A\u5206\u7B49\u7EA7\u3002", {
    inner: "\u4EA4\u9886\u4E2D\u8863, \u7CFB\u5E26\u5DE5\u6574",
    top: "\u7A84\u8896\u77ED\u8966, \u8863\u957F\u81F3\u8170, \u9886\u7F18\u538B\u4E00\u9053\u7D20\u7EC7\u5E26",
    bottom: "\u53CA\u5730\u957F\u88D9, \u88D9\u8170\u9AD8\u675F\u4E8E\u80F8\u4E0B",
    outerwear: "\u534A\u81C2\u5BF9\u895F\u5C0F\u886B, \u4FBF\u4E8E\u884C\u52A8",
    legwear: "\u68C9\u5E03\u7F57\u889C",
    shoes: "\u5E73\u5934\u8F6F\u5C65",
    accessory: "\u53CC\u73AF\u53D1\u9AFB\u5404\u7C2A\u4E00\u679A\u7D20\u94DC\u82B1\u94BF, \u8170\u7CFB\u6C57\u5DFE"
  }, ["16-20", "21-28"]),
  c2("wld-anc-female-governess", "\u6559\u517B\u5B37\u5B37\u5E38\u670D", "female", ["ancient"], ["\u5B37\u5B37", "\u6559\u517B\u59D1\u59D1", "\u5BAB\u5EF7", "\u4E25\u5389", "\u53E4\u88C5"], "\u638C\u89C4\u77E9\u7684\u8001\u5B37\u5B37, \u8863\u7740\u4E00\u4E1D\u4E0D\u82DF\u3001\u5C42\u5C42\u9F50\u6574, \u65E0\u4E00\u5904\u677E\u6563\u3002", {
    inner: "\u9AD8\u9886\u4E2D\u8863, \u6263\u81F3\u9888\u4E0B",
    top: "\u4EA4\u9886\u957F\u8966, \u8863\u7F18\u538B\u4E24\u9053\u7EC7\u5E26, \u8896\u53E3\u6536\u7A84",
    bottom: "\u9A6C\u9762\u88D9, \u8936\u88E5\u538B\u5F97\u6781\u5E73",
    outerwear: "\u5BF9\u895F\u957F\u8919\u5B50, \u76F4\u8EAB\u4E0D\u6536\u8170",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u539A\u5E95\u65B9\u53E3\u978B",
    accessory: "\u7D27\u5B9E\u5706\u9AFB\u63D2\u4E00\u652F\u7D20\u7C2A, \u624B\u633D\u5FF5\u73E0\u4E00\u4E32"
  }, ["39-50", "51-65"]),
  c2("wld-anc-female-consort", "\u5983\u5AD4\u5927\u5986", "female", ["ancient"], ["\u5983\u5AD4", "\u8D35\u5983", "\u5BAB\u6597", "\u534E\u8D35", "\u53E4\u88C5"], "\u4F4D\u5206\u9AD8\u7684\u540E\u5BAB\u5973\u5B50, \u5C42\u6570\u591A\u3001\u5DE5\u827A\u91CD, \u4E00\u8EAB\u884C\u5934\u5C31\u662F\u8EAB\u4EFD\u5BA3\u793A\u3002", {
    inner: "\u8F7B\u7EB1\u62B9\u80F8, \u8FB9\u7F18\u7F00\u7EC6\u73E0",
    top: "\u5E7F\u8896\u4E0A\u8966, \u9886\u53E3\u5F00\u9614, \u6EE1\u7EE3\u7F20\u679D\u7EB9",
    bottom: "\u66F3\u5730\u957F\u88D9, \u88D9\u5E45\u6781\u5BBD, \u4E0B\u6446\u7EC7\u4E91\u7EB9",
    outerwear: "\u5927\u8896\u62AB\u5E1B\u7ED5\u81C2\u5782\u843D, \u957F\u53CA\u88D9\u6446",
    legwear: "\u7EC6\u7EB1\u7F57\u889C",
    shoes: "\u9AD8\u7FD8\u5934\u7EE3\u978B",
    accessory: "\u9AD8\u9AFB\u6EE1\u63D2\u6B65\u6447\u4E0E\u7C2A\u9497, \u8033\u5760\u5782\u73E0, \u9888\u6234\u748E\u73DE"
  }, ["21-28", "29-38"]),
  c2("wld-anc-female-warrior", "\u5C06\u95E8\u864E\u5973\u9A91\u88C5", "female", ["ancient"], ["\u5C06\u95E8", "\u5973\u5C06", "\u82F1\u6C14", "\u9A91\u5C04", "\u53E4\u88C5"], "\u4F1A\u9A91\u9A6C\u5F00\u5F13\u7684\u5C06\u95E8\u5973\u513F, \u8863\u88E4\u5206\u660E\u3001\u4E0D\u7740\u957F\u88D9, \u5229\u843D\u538B\u8FC7\u79C0\u6C14\u3002", {
    inner: "\u7A84\u8896\u5185\u886C, \u6536\u8155\u6536\u8170",
    top: "\u4EA4\u9886\u77ED\u8884, \u8863\u957F\u53CA\u80EF, \u8170\u675F\u5BBD\u5E26",
    bottom: "\u675F\u53E3\u9A91\u88E4, \u5185\u4FA7\u52A0\u7F1D\u76AE\u7247",
    outerwear: "\u77ED\u76AE\u7532\u80CC\u5FC3, \u80A9\u90E8\u7F00\u62A4\u7247",
    legwear: "\u7F20\u817F\u81F3\u819D",
    shoes: "\u77ED\u7B52\u9A91\u9774",
    accessory: "\u9AD8\u9A6C\u5C3E\u7528\u76AE\u7EF3\u675F\u8D77, \u81C2\u7F1A\u62A4\u8155"
  }, ["16-20", "21-28"]),
  c2("wld-anc-female-healer", "\u5973\u533B\u884C\u88C5", "female", ["ancient"], ["\u5973\u533B", "\u533B\u5973", "\u6C89\u9759", "\u4E13\u4E1A", "\u53E4\u88C5"], "\u51FA\u8BCA\u7684\u5973\u533B\u8005, \u8896\u53E3\u5FC5\u6536\u3001\u4E0B\u6446\u5FC5\u77ED, \u4E00\u5207\u4EE5\u4FBF\u4E8E\u65BD\u9488\u95EE\u8BCA\u4E3A\u51C6\u3002", {
    inner: "\u4EA4\u9886\u4E2D\u8863, \u8896\u7A84",
    top: "\u7A84\u8896\u4E0A\u8966, \u8863\u895F\u7CFB\u5E26\u5728\u4FA7, \u4FBF\u4E8E\u4FEF\u8EAB",
    bottom: "\u53CA\u8E1D\u957F\u88D9, \u88D9\u88FE\u4E0D\u62D6\u5730",
    outerwear: "\u5BF9\u895F\u77ED\u886B\u7F69\u5728\u5916, \u524D\u895F\u522B\u4E00\u6392\u7EC6\u9488\u56CA",
    legwear: "\u68C9\u5E03\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u978B",
    accessory: "\u4F4E\u9AFB\u7528\u6728\u7C2A\u56FA\u5B9A, \u630E\u85E4\u7F16\u836F\u56CA"
  }, ["21-28", "29-38"]),
  c2("wld-anc-female-dowager", "\u8001\u592B\u4EBA\u8BF0\u547D\u5E38\u670D", "female", ["ancient"], ["\u8001\u592B\u4EBA", "\u8BF0\u547D", "\u957F\u8F88", "\u5A01\u4E25", "\u53E4\u88C5"], "\u5F53\u5BB6\u7684\u8001\u592A\u592A, \u7528\u6599\u539A\u91CD\u3001\u7EB9\u6837\u7AEF\u65B9, \u4E0D\u5F20\u626C\u4F46\u6BCF\u4E00\u5904\u90FD\u4E0D\u4FBF\u5B9C\u3002", {
    inner: "\u9AD8\u9886\u4E2D\u8863",
    top: "\u4EA4\u9886\u5927\u895F\u957F\u8884, \u7F18\u8FB9\u7EC7\u5BFF\u5B57\u7EB9, \u8863\u8EAB\u5BBD\u8212",
    bottom: "\u9614\u5E45\u957F\u88D9, \u88D9\u95E8\u7EE3\u56E2\u7EB9",
    outerwear: "\u5BF9\u895F\u957F\u6BD4\u7532, \u6BDB\u7F18\u9886\u53E3",
    legwear: "\u539A\u7F0E\u889C",
    shoes: "\u5E73\u5E95\u539A\u7ED2\u978B",
    accessory: "\u62B9\u989D\u4E00\u9053, \u624B\u6301\u957F\u67C4\u62D0, \u8155\u4E0A\u4E00\u53EA\u5BBD\u7389\u956F"
  }, ["51-65", "66-80"]),
  c2("wld-anc-female-dancer", "\u4F36\u4EBA\u620F\u88C5", "female", ["ancient"], ["\u4F36\u4EBA", "\u821E\u59EC", "\u620F\u5B50", "\u59A9\u5A9A", "\u53E4\u88C5"], "\u53F0\u4E0A\u8BA8\u751F\u6D3B\u7684\u4F36\u4EBA, \u88D9\u5E45\u4E0E\u6C34\u8896\u4E3A\u821E\u52A8\u8BBE\u8BA1, \u5986\u9020\u6BD4\u65E5\u5E38\u6D53\u4E00\u500D\u3002", {
    inner: "\u8D34\u8EAB\u62B9\u80F8, \u675F\u5F97\u6781\u7D27",
    top: "\u7A84\u8EAB\u821E\u8863, \u63A5\u6781\u957F\u6C34\u8896, \u8896\u53E3\u7F00\u7EC6\u94C3",
    bottom: "\u591A\u5C42\u65CB\u88D9, \u88D9\u88FE\u8F7B\u8584\u80FD\u968F\u52A8\u4F5C\u626C\u8D77",
    outerwear: "\u8F7B\u7EB1\u5916\u7F69, \u524D\u895F\u4E0D\u7CFB, \u968F\u6B65\u98D8\u52A8",
    legwear: "\u8584\u7EB1\u8DB3\u8863",
    shoes: "\u8F6F\u5E95\u821E\u978B, \u978B\u5934\u5FAE\u7FD8",
    accessory: "\u9AFB\u4E0A\u82B1\u51A0\u4E00\u9876, \u81C2\u73AF\u4E0E\u8170\u94C3\u6210\u5BF9"
  }, ["16-20", "21-28"]),
  c2("wld-anc-female-village", "\u519C\u5987\u5E03\u88D9", "female", ["ancient", "rural"], ["\u519C\u5987", "\u7530\u820D", "\u64CD\u52B3", "\u6734\u5B9E", "\u53E4\u88C5"], "\u4E61\u4E0B\u64CD\u6301\u5BB6\u52A1\u7684\u5987\u4EBA, \u8863\u670D\u8010\u6D17\u8010\u78E8, \u56F4\u88D9\u4ECE\u4E0D\u79BB\u8EAB\u3002", {
    inner: "\u7C97\u5E03\u4E2D\u8863",
    top: "\u5927\u895F\u77ED\u8902, \u8896\u5B50\u633D\u8D77, \u8863\u895F\u5904\u78E8\u5F97\u8D77\u6BDB",
    bottom: "\u53CA\u8E1D\u5E03\u88D9, \u88D9\u6446\u6CBE\u6CE5\u4E0D\u6613\u770B\u51FA",
    outerwear: "\u539A\u5E03\u574E\u80A9, \u51AC\u65E5\u52A0\u7A7F",
    legwear: "\u7C97\u5E03\u88F9\u811A\u5E03",
    shoes: "\u81EA\u7EB3\u5E03\u978B, \u978B\u5E2E\u8D77\u76B1",
    accessory: "\u7D20\u5E03\u5305\u5934, \u8170\u7CFB\u7C97\u5E03\u56F4\u88D9"
  }, ["29-38", "39-50", "51-65"]),
  c2("wld-anc-female-maid", "\u5A62\u5973\u77ED\u8966", "female", ["ancient"], ["\u5A62\u5973", "\u4E2B\u9B1F", "\u4F8D\u5973", "\u4F36\u4FD0", "\u53E4\u88C5"], "\u5185\u5B85\u4F7F\u5524\u7684\u4E2B\u5934, \u8863\u957F\u77ED\u3001\u675F\u5F97\u7D27, \u968F\u65F6\u80FD\u8DD1\u817F\u5E72\u6D3B\u3002", {
    inner: "\u7D20\u4E2D\u8863",
    top: "\u7A84\u8896\u77ED\u8966, \u8863\u957F\u4EC5\u53CA\u8170, \u7CFB\u5E26\u5728\u4FA7",
    bottom: "\u53CA\u8E1D\u7D20\u88D9, \u88D9\u5E45\u504F\u7A84\u4FBF\u4E8E\u5FEB\u8D70",
    outerwear: "\u51AC\u65E5\u52A0\u4E00\u4EF6\u5BF9\u895F\u77ED\u68C9\u8902",
    legwear: "\u68C9\u5E03\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u978B, \u978B\u5E95\u8584",
    accessory: "\u53CC\u4E2B\u9AFB\u7CFB\u5E03\u7EF3, \u8170\u95F4\u6302\u4E00\u65B9\u6C57\u5DFE"
  }, ["16-20", "21-28"]),
  c2("wld-anc-female-swordswoman", "\u5973\u4FA0\u591C\u884C\u52B2\u88C5", "female", ["ancient"], ["\u5973\u4FA0", "\u6C5F\u6E56", "\u591C\u884C", "\u51B7\u51BD", "\u53E4\u88C5"], "\u72EC\u884C\u6C5F\u6E56\u7684\u5973\u5B50, \u5168\u8EAB\u6536\u675F\u65E0\u4E00\u5904\u98D8\u8361, \u53EA\u4E3A\u591C\u91CC\u52A8\u624B\u65B9\u4FBF\u3002", {
    inner: "\u8D34\u8EAB\u7A84\u8896\u5185\u886C",
    top: "\u4EA4\u9886\u52B2\u88C5, \u8863\u957F\u53CA\u80EF, \u8170\u675F\u5BBD\u5E26\u52D2\u7D27",
    bottom: "\u675F\u53E3\u957F\u88E4, \u88E4\u811A\u624E\u8FDB\u9774\u7B52",
    outerwear: "\u77ED\u6597\u7BF7, \u5E26\u98CE\u5E3D, \u7CFB\u4E8E\u9888\u4FA7",
    legwear: "\u7F20\u817F\u5E03\u5E26",
    shoes: "\u8584\u5E95\u8F6F\u9774, \u843D\u5730\u65E0\u58F0",
    accessory: "\u9AD8\u9A6C\u5C3E\u7528\u5E03\u5E26\u675F\u7D27, \u9762\u8986\u534A\u5E45\u906E\u5DFE, \u80CC\u8D1F\u957F\u5251"
  }, ["21-28", "29-38"]),
  // ================= 仙侠(xianxia) =================
  c2("wld-xx-male-sword-disciple", "\u5916\u95E8\u5251\u4FEE\u5F1F\u5B50\u52B2\u88C5", "male", ["xianxia"], ["\u5251\u4FEE", "\u5F1F\u5B50", "\u5916\u95E8", "\u5C11\u5E74", "\u4ED9\u4FA0"], "\u521A\u5165\u5B97\u95E8\u7684\u5251\u4FEE, \u5236\u5F0F\u5F1F\u5B50\u670D, \u4E00\u5207\u4EE5\u7EC3\u5251\u65B9\u4FBF\u4E3A\u5148, \u65E0\u591A\u4F59\u5782\u5760\u3002", {
    inner: "\u7A84\u8896\u4EA4\u9886\u5185\u886C, \u6536\u8155",
    top: "\u675F\u8EAB\u5F1F\u5B50\u670D, \u7ACB\u9886\u76D8\u6263, \u524D\u895F\u7EE3\u5B97\u95E8\u7EB9\u4E00\u679A",
    bottom: "\u675F\u53E3\u7EC3\u529F\u88E4, \u819D\u90E8\u52A0\u7F1D\u62A4\u7247",
    outerwear: "\u77ED\u7F69\u886B, \u4E24\u4FA7\u5F00\u8869\u81F3\u8170, \u4FBF\u4E8E\u62BD\u5251",
    legwear: "\u5E03\u5236\u7ED1\u817F",
    shoes: "\u8584\u5E95\u4E91\u5934\u8F6F\u9774",
    accessory: "\u9AD8\u675F\u53D1\u7528\u7D20\u5E26, \u80CC\u8D1F\u5251\u9798, \u8155\u7F20\u62A4\u5E26"
  }, ["16-20", "21-28"]),
  c2("wld-xx-male-inner-disciple", "\u5185\u95E8\u9996\u5E2D\u6CD5\u8863", "male", ["xianxia"], ["\u5251\u4FEE", "\u9996\u5E2D", "\u5185\u95E8", "\u6E05\u51B7", "\u4ED9\u4FA0"], "\u5185\u95E8\u62D4\u5C16\u7684\u5F1F\u5B50, \u6CD5\u8863\u7528\u6599\u4E00\u7B49, \u4E91\u7EB9\u968F\u7075\u529B\u6D41\u52A8, \u6C14\u8D28\u538B\u8FC7\u540C\u95E8\u3002", {
    inner: "\u7EC6\u7EB1\u4E2D\u8863, \u9886\u7F18\u7EC7\u4E91\u96F7\u7EB9",
    top: "\u4EA4\u9886\u5E7F\u8896\u6CD5\u8863, \u8863\u8EAB\u6697\u7EC7\u6D41\u4E91\u7EB9, \u8170\u675F\u7389\u6263",
    bottom: "\u5782\u5760\u957F\u88E4, \u4E0E\u8863\u8EAB\u540C\u6599",
    outerwear: "\u5916\u62AB\u8F7B\u7EB1\u9E64\u6C05, \u540E\u6446\u53CA\u8E1D, \u884C\u8D70\u65F6\u5FAE\u626C",
    legwear: "\u7D20\u7F57\u889C",
    shoes: "\u4E91\u5934\u8F6F\u9774, \u9774\u9762\u538B\u7965\u4E91",
    accessory: "\u7389\u51A0\u675F\u53D1, \u5251\u7A57\u5782\u4E8E\u8170\u4FA7, \u8155\u60AC\u50A8\u7269\u73AF"
  }, ["21-28", "29-38"]),
  c2("wld-xx-male-sect-master", "\u4E00\u5B97\u638C\u95E8\u9053\u888D", "male", ["xianxia"], ["\u638C\u95E8", "\u5B97\u4E3B", "\u957F\u8005", "\u5A01\u538B", "\u4ED9\u4FA0"], "\u4E00\u5B97\u4E4B\u4E3B, \u9053\u888D\u5F62\u5236\u6700\u9AD8, \u5C42\u6570\u4E0E\u7EB9\u6837\u90FD\u5728\u5BA3\u793A\u9053\u7EDF\u3002", {
    inner: "\u9AD8\u9886\u4E2D\u8863, \u6263\u81F3\u9888",
    top: "\u4EA4\u9886\u9053\u888D, \u8863\u5E45\u6781\u9614, \u524D\u895F\u7EC7\u516B\u5366\u4E0E\u661F\u6597\u7EB9",
    bottom: "\u540C\u6599\u4E0B\u88F3, \u88FE\u957F\u66F3\u5730",
    outerwear: "\u5927\u8896\u7F69\u888D, \u9886\u7F18\u7EC7\u5B97\u95E8\u5FBD\u8BB0\u9614\u8FB9",
    legwear: "\u539A\u7F0E\u957F\u889C",
    shoes: "\u539A\u5E95\u65B9\u5C65",
    accessory: "\u83B2\u82B1\u51A0\u675F\u53D1, \u624B\u6301\u62C2\u5C18, \u8170\u60AC\u638C\u95E8\u4EE4\u724C"
  }, ["39-50", "51-65"]),
  c2("wld-xx-male-demon-lord", "\u9B54\u9053\u5C0A\u8005\u5E7F\u8896", "male", ["xianxia"], ["\u9B54\u5C0A", "\u9B54\u9053", "\u90AA\u9B45", "\u538B\u8FEB\u611F", "\u4ED9\u4FA0"], "\u9B54\u9053\u4E00\u65B9\u4E4B\u4E3B, \u8863\u895F\u655E\u5F97\u6BD4\u6B63\u9053\u4F4E, \u7EB9\u6837\u5E26\u5C16\u9510\u68F1\u89D2, \u6C14\u573A\u90AA\u51B7\u3002", {
    inner: "\u655E\u9886\u5185\u886C, \u524D\u895F\u5F00\u81F3\u80F8\u53E3",
    top: "\u4EA4\u9886\u5927\u8896\u888D, \u8863\u8EAB\u7EC7\u68F1\u523A\u72B6\u6697\u7EB9, \u8170\u8EAB\u675F\u5F97\u6781\u7D27",
    bottom: "\u5782\u5760\u957F\u88E4, \u4FA7\u7F1D\u5F00\u9AD8\u8869",
    outerwear: "\u539A\u91CD\u5916\u888D, \u9AD8\u7AD6\u9886\u7ACB\u81F3\u8033\u540E, \u540E\u6446\u957F\u800C\u62D6\u66F3",
    legwear: "\u76AE\u8D28\u62A4\u817F",
    shoes: "\u9AD8\u7B52\u786C\u9774, \u9774\u53E3\u7FFB\u5377",
    accessory: "\u989D\u7F00\u4E00\u679A\u5C16\u89D2\u9970, \u6307\u6234\u591A\u679A\u6212\u6307, \u8170\u94FE\u5782\u9AA8\u73E0"
  }, ["29-38", "39-50"]),
  c2("wld-xx-male-alchemist", "\u4E39\u4FEE\u836F\u888D", "male", ["xianxia"], ["\u4E39\u4FEE", "\u70BC\u4E39", "\u836F\u5E08", "\u4E13\u6CE8", "\u4ED9\u4FA0"], "\u5E38\u5E74\u5B88\u7089\u7684\u4E39\u4FEE, \u8896\u53E3\u5FC5\u6536\u3001\u5916\u888D\u5E26\u706B\u71CE\u75D5, \u4E00\u8EAB\u836F\u6C14\u3002", {
    inner: "\u7A84\u8896\u5185\u886C",
    top: "\u4EA4\u9886\u77ED\u888D, \u8896\u53E3\u7528\u76AE\u6263\u6536\u7D27, \u8863\u895F\u522B\u4E00\u6392\u836F\u56CA",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u88E4\u811A\u624E\u7D27",
    outerwear: "\u53CA\u819D\u7F69\u888D, \u524D\u895F\u4E0E\u8896\u7F18\u6709\u7089\u706B\u71CE\u8FC7\u7684\u7126\u75D5",
    legwear: "\u539A\u5E03\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u9774, \u978B\u9762\u6CBE\u836F\u672B",
    accessory: "\u8170\u60AC\u4E00\u4E32\u846B\u82A6\u4E0E\u4E39\u74F6, \u675F\u53D1\u7528\u4E00\u6839\u836F\u5319"
  }, ["29-38", "39-50"]),
  c2("wld-xx-male-artificer", "\u5668\u4FEE\u94F8\u5251\u88C5", "male", ["xianxia"], ["\u5668\u4FEE", "\u94F8\u5251", "\u5320\u4EBA", "\u786C\u6717", "\u4ED9\u4FA0"], "\u5B88\u7740\u70BC\u5668\u7089\u7684\u5668\u4FEE, \u76AE\u9769\u62A4\u5177\u6BD4\u5E03\u6599\u591A, \u524D\u895F\u6EE1\u662F\u706B\u661F\u70EB\u70B9\u3002", {
    inner: "\u65E0\u8896\u5185\u886B, \u9732\u51FA\u7ED3\u5B9E\u5C0F\u81C2",
    top: "\u76AE\u8D28\u56F4\u80F8\u62A4\u7532, \u94C6\u9489\u538B\u8FB9, \u5355\u80A9\u52A0\u539A",
    bottom: "\u539A\u5E03\u5DE5\u88E4, \u819D\u76D6\u7F1D\u76AE\u8865\u4E01",
    outerwear: "\u539A\u76AE\u56F4\u88D9, \u81EA\u80F8\u81F3\u819D, \u6EE1\u5E03\u70EB\u70B9",
    legwear: "\u76AE\u8D28\u62A4\u817F",
    shoes: "\u539A\u5E95\u94C1\u5934\u9774",
    accessory: "\u81C2\u7F1A\u62A4\u8155, \u8170\u6302\u953B\u9524\u4E0E\u94B3\u5177"
  }, ["29-38", "39-50"]),
  c2("wld-xx-male-rogue-cultivator", "\u6563\u4FEE\u6E38\u5386\u88C5", "male", ["xianxia"], ["\u6563\u4FEE", "\u6E38\u5386", "\u6C5F\u6E56", "\u843D\u62D3", "\u4ED9\u4FA0"], "\u65E0\u5B97\u65E0\u95E8\u7684\u6563\u4FEE, \u8863\u7740\u6742\u62FC\u3001\u65E7\u800C\u5B9E\u7528, \u4E00\u770B\u5C31\u662F\u5E38\u5E74\u5728\u5916\u98CE\u9910\u9732\u5BBF\u3002", {
    inner: "\u6D17\u65E7\u4EA4\u9886\u5185\u886C",
    top: "\u77ED\u6253\u4E0A\u8863, \u8865\u4E01\u4E0E\u65B0\u5E03\u62FC\u63A5, \u8170\u675F\u7C97\u5E03\u5E26",
    bottom: "\u80A5\u817F\u957F\u88E4, \u88E4\u811A\u7F20\u5E03",
    outerwear: "\u534A\u65E7\u6597\u7BF7, \u8FB9\u7F18\u78E8\u51FA\u6BDB\u987B, \u5E26\u98CE\u5E3D",
    legwear: "\u7F20\u817F\u5E03\u6761",
    shoes: "\u786C\u5E95\u8D70\u5C71\u9774, \u9774\u5E2E\u5F00\u88C2\u540E\u53C8\u8865\u8FC7",
    accessory: "\u80CC\u7AF9\u7BD3, \u8170\u60AC\u9152\u846B\u82A6\u4E0E\u6B8B\u7834\u50A8\u7269\u888B"
  }, ["21-28", "29-38"]),
  c2("wld-xx-male-elder", "\u592A\u4E0A\u957F\u8001\u9E64\u6C05", "male", ["xianxia"], ["\u957F\u8001", "\u592A\u4E0A", "\u8004\u800B", "\u4ED9\u98CE", "\u4ED9\u4FA0"], "\u95ED\u5173\u591A\u5E74\u7684\u8001\u7956\u8F88, \u8863\u888D\u5BBD\u8212\u5230\u4E0D\u89C1\u5F62\u4F53, \u5168\u9760\u6C14\u5EA6\u6491\u8D77\u3002", {
    inner: "\u5BBD\u8212\u4E2D\u8863",
    top: "\u5927\u8896\u957F\u888D, \u8863\u8EAB\u65E0\u6536\u8170, \u901A\u4F53\u53EA\u7559\u7D20\u9762",
    bottom: "\u540C\u6599\u957F\u88F3, \u4E0B\u6446\u5806\u53E0",
    outerwear: "\u9E64\u6C05, \u901A\u4F53\u4E00\u7247, \u9886\u53E3\u7F00\u7FBD\u7ED2\u6BDB\u7F18",
    legwear: "\u539A\u7F0E\u889C",
    shoes: "\u5E73\u5E95\u4E91\u5C65",
    accessory: "\u957F\u9AEF\u5782\u80F8, \u624B\u6301\u85E4\u6756, \u9876\u633D\u53D1\u9AFB\u63D2\u6728\u7C2A"
  }, ["66-80", "80+"]),
  c2("wld-xx-male-servant-disciple", "\u6742\u5F79\u5F1F\u5B50\u7C97\u8863", "male", ["xianxia"], ["\u6742\u5F79", "\u5F1F\u5B50", "\u5C11\u5E74", "\u5351\u5FAE", "\u4ED9\u4FA0"], "\u5B97\u95E8\u91CC\u5E72\u6742\u6D3B\u7684\u5916\u56F4\u5F1F\u5B50, \u7C97\u5E03\u77ED\u8863, \u65E0\u4EFB\u4F55\u5B97\u95E8\u7EB9\u6837\u3002", {
    inner: "\u7C97\u9EBB\u6C57\u886B",
    top: "\u5BF9\u895F\u77ED\u8902, \u8896\u5B50\u633D\u8D77, \u524D\u895F\u65E0\u7EB9",
    bottom: "\u77ED\u88E4\u6216\u633D\u8D77\u7684\u957F\u88E4",
    outerwear: "\u65E0\u5916\u5957\u5C42",
    legwear: "\u8D64\u8DB3\u6216\u7C97\u5E03\u7F20\u817F",
    shoes: "\u8349\u978B, \u978B\u5E26\u65AD\u8FC7\u91CD\u7CFB",
    accessory: "\u8170\u7CFB\u9EBB\u7EF3, \u80A9\u642D\u4E00\u6761\u6C57\u5DFE"
  }, ["16-20"]),
  c2("wld-xx-male-beast-tamer", "\u5FA1\u517D\u5E08\u76AE\u7532", "male", ["xianxia"], ["\u5FA1\u517D", "\u517D\u4FEE", "\u91CE\u6027", "\u7C97\u72B7", "\u4ED9\u4FA0"], "\u4E0E\u7075\u517D\u5171\u5904\u7684\u5FA1\u517D\u5E08, \u517D\u9AA8\u4E0E\u76AE\u9769\u505A\u88C5\u9970, \u8863\u7740\u5E26\u5C71\u6797\u6C14\u3002", {
    inner: "\u517D\u76AE\u65E0\u8896\u5185\u886C",
    top: "\u76AE\u7532\u4E0A\u8863, \u80A9\u90E8\u7F00\u517D\u9AA8\u7247, \u7F1D\u7EBF\u7C97\u5927",
    bottom: "\u517D\u76AE\u77ED\u88E4\u5916\u63A5\u5E03\u8D28\u957F\u88E4",
    outerwear: "\u6574\u5F20\u517D\u76AE\u62AB\u80A9, \u517D\u9996\u642D\u4E8E\u4E00\u4FA7\u80A9\u5934",
    legwear: "\u76AE\u7ED1\u817F, \u4EA4\u53C9\u7CFB\u5E26\u81F3\u819D",
    shoes: "\u517D\u76AE\u8F6F\u9774",
    accessory: "\u9888\u6302\u517D\u7259\u4E32, \u8155\u7F1A\u9AA8\u73AF, \u8170\u60AC\u517D\u54E8"
  }, ["21-28", "29-38"]),
  c2("wld-xx-female-sword-cultivator", "\u5973\u5251\u4FEE\u675F\u8EAB\u6CD5\u8863", "female", ["xianxia"], ["\u5251\u4FEE", "\u5973\u4FEE", "\u6E05\u51B7", "\u51CC\u5389", "\u4ED9\u4FA0"], "\u8D70\u5251\u9053\u7684\u5973\u4FEE, \u6CD5\u8863\u6536\u8EAB\u4E0D\u62D6\u6C93, \u88D9\u88FE\u5F00\u9AD8\u8869\u4EE5\u4FBF\u817E\u8DC3\u3002", {
    inner: "\u8D34\u8EAB\u7A84\u8896\u5185\u886C",
    top: "\u4EA4\u9886\u675F\u8EAB\u4E0A\u8863, \u8170\u675F\u5BBD\u7EE6\u52D2\u51FA\u8170\u7EBF",
    bottom: "\u53CA\u8E1D\u957F\u88D9, \u4E24\u4FA7\u5F00\u9AD8\u8869, \u5185\u886C\u675F\u53E3\u88E4",
    outerwear: "\u77ED\u62AB\u98CE, \u540E\u6446\u8FC7\u8170\u5373\u6B62",
    legwear: "\u8584\u7ED1\u817F",
    shoes: "\u8F6F\u5E95\u4E91\u9774",
    accessory: "\u9AD8\u9A6C\u5C3E\u7528\u7389\u73AF\u675F\u8D77, \u80CC\u8D1F\u957F\u5251, \u8155\u7F20\u62A4\u5E26"
  }, ["21-28", "29-38"]),
  c2("wld-xx-female-saintess", "\u5723\u5973\u793C\u670D", "female", ["xianxia"], ["\u5723\u5973", "\u5B97\u95E8", "\u9AD8\u6D01", "\u796D\u7940", "\u4ED9\u4FA0"], "\u5B97\u95E8\u4F9B\u5949\u7684\u5723\u5973, \u5C42\u7EB1\u53E0\u7F69\u3001\u7EB9\u6837\u5BF9\u79F0, \u4E00\u8EAB\u884C\u5934\u4E3A\u796D\u5178\u800C\u8BBE\u3002", {
    inner: "\u8F7B\u7EB1\u62B9\u80F8, \u8FB9\u7F00\u7EC6\u73E0",
    top: "\u5E7F\u8896\u4E0A\u8966, \u9886\u53E3\u6B63\u5706, \u80A9\u8986\u56DB\u5408\u4E91\u80A9",
    bottom: "\u591A\u5C42\u7EB1\u88D9, \u66F3\u5730\u6781\u957F, \u88D9\u7F18\u7EC7\u661F\u7EB9",
    outerwear: "\u901A\u4F53\u8584\u7EB1\u5916\u7F69, \u81EA\u80A9\u5782\u843D, \u534A\u900F",
    legwear: "\u7EC6\u7EB1\u8DB3\u8863",
    shoes: "\u8F6F\u5E95\u7FD8\u5934\u7EE3\u5C65",
    accessory: "\u989D\u5FC3\u8D34\u82B1\u94BF, \u9AD8\u51A0\u7F00\u5782\u73E0\u5E18, \u8155\u60AC\u957F\u6D41\u82CF"
  }, ["16-20", "21-28"]),
  c2("wld-xx-female-peak-master", "\u5CF0\u4E3B\u957F\u8001\u5E7F\u8896", "female", ["xianxia"], ["\u5CF0\u4E3B", "\u957F\u8001", "\u5973\u4FEE", "\u6C89\u7A33", "\u4ED9\u4FA0"], "\u72EC\u638C\u4E00\u5CF0\u7684\u5973\u957F\u8001, \u5E7F\u8896\u7AEF\u5E84\u3001\u7EB9\u6837\u514B\u5236, \u5A01\u4EEA\u6765\u81EA\u5F62\u5236\u800C\u975E\u9970\u7269\u3002", {
    inner: "\u9AD8\u9886\u4E2D\u8863",
    top: "\u4EA4\u9886\u5E7F\u8896\u4E0A\u8863, \u8863\u7F18\u7EC7\u56DE\u7EB9\u9614\u8FB9, \u8170\u675F\u7389\u5E26",
    bottom: "\u9614\u5E45\u957F\u88D9, \u88D9\u95E8\u538B\u6697\u7EB9",
    outerwear: "\u5BF9\u895F\u957F\u5916\u888D, \u76F4\u8EAB\u4E0D\u6536\u8170, \u540E\u6446\u53CA\u5730",
    legwear: "\u539A\u7F0E\u889C",
    shoes: "\u5E73\u5E95\u539A\u5C65",
    accessory: "\u53D1\u9AFB\u7AEF\u6B63\u63D2\u4E00\u652F\u957F\u7C2A, \u8170\u60AC\u5CF0\u4E3B\u4EE4"
  }, ["39-50", "51-65"]),
  c2("wld-xx-female-fox-spirit", "\u72D0\u65CF\u5996\u4FEE", "female", ["xianxia"], ["\u5996\u65CF", "\u72D0\u65CF", "\u5A9A\u8272", "\u7075\u52A8", "\u4ED9\u4FA0"], "\u5316\u5F62\u4E0D\u4E45\u7684\u72D0\u65CF, \u8863\u6599\u8F7B\u8584\u8D34\u8EAB, \u6BDB\u9886\u4E0E\u5C3E\u9970\u662F\u8EAB\u4EFD\u6807\u8BB0\u3002", {
    inner: "\u8D34\u8EAB\u62B9\u80F8, \u7CFB\u5E26\u5728\u540E",
    top: "\u659C\u895F\u77ED\u8863, \u9886\u53E3\u504F\u4F4E, \u8896\u53E3\u4F5C\u5587\u53ED\u72B6\u6563\u5F00",
    bottom: "\u5F00\u8869\u957F\u88D9, \u88D9\u88FE\u8F7B\u76C8\u968F\u6B65\u626C\u8D77",
    outerwear: "\u6BDB\u7F18\u77ED\u62AB\u80A9, \u677E\u677E\u642D\u5728\u4E24\u80A9",
    legwear: "\u8584\u7EB1\u8DB3\u8863",
    shoes: "\u8F6F\u5E95\u77EE\u9774, \u9774\u53E3\u7F00\u7ED2",
    accessory: "\u8033\u540E\u7C2A\u4E00\u6735\u7ED2\u82B1, \u9888\u7CFB\u94C3\u94DB, \u8170\u540E\u5782\u5C3E\u9970"
  }, ["21-28", "29-38"]),
  c2("wld-xx-female-pill-disciple", "\u4E39\u9601\u5973\u5F1F\u5B50", "female", ["xianxia"], ["\u4E39\u4FEE", "\u5973\u5F1F\u5B50", "\u7075\u5DE7", "\u4E13\u6CE8", "\u4ED9\u4FA0"], "\u5728\u4E39\u9601\u6253\u4E0B\u624B\u7684\u5973\u5F1F\u5B50, \u8896\u53E3\u6536\u5F97\u6B7B\u7D27, \u56F4\u88D9\u4E0A\u836F\u6E0D\u5C42\u5C42\u53E0\u53E0\u3002", {
    inner: "\u7A84\u8896\u5185\u886C",
    top: "\u77ED\u8966\u4E0A\u8863, \u8896\u53E3\u7528\u7EE6\u5E26\u7F20\u7D27\u81F3\u8098",
    bottom: "\u53CA\u8E1D\u77ED\u88D9, \u88D9\u957F\u4E0D\u62D6\u5730",
    outerwear: "\u524D\u7CFB\u56F4\u88D9, \u81EA\u80F8\u81F3\u819D, \u5E03\u9762\u6709\u6D17\u4E0D\u51C0\u7684\u836F\u6E0D",
    legwear: "\u5E03\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u978B",
    accessory: "\u53CC\u9AFB\u7528\u5E03\u7EF3\u675F\u4F4F, \u8170\u95F4\u60AC\u4E00\u6392\u5C0F\u836F\u74F6"
  }, ["16-20", "21-28"]),
  c2("wld-xx-female-demon-empress", "\u9B54\u9053\u5973\u5C0A", "female", ["xianxia"], ["\u9B54\u9053", "\u5973\u5C0A", "\u5996\u5F02", "\u5F3A\u52BF", "\u4ED9\u4FA0"], "\u9B54\u9053\u6267\u638C\u8005, \u9AD8\u7AD6\u9886\u4E0E\u5C16\u89D2\u9970\u628A\u6C14\u573A\u5806\u5230\u6781\u81F4, \u8863\u7EBF\u950B\u5229\u3002", {
    inner: "\u8D34\u8EAB\u9AD8\u9886\u5185\u886C",
    top: "\u675F\u8EAB\u4E0A\u8863, \u80A9\u90E8\u7ACB\u8D77\u5C16\u89D2\u62A4\u80A9, \u8170\u8EAB\u6536\u6781\u7A84",
    bottom: "\u5F00\u8869\u957F\u88D9, \u4E00\u4FA7\u5F00\u81F3\u80EF, \u5185\u886C\u7D27\u8EAB\u88E4",
    outerwear: "\u66F3\u5730\u957F\u888D, \u7ACB\u9886\u9AD8\u7AD6\u81F3\u8033\u540E, \u540E\u6446\u5448\u9510\u89D2",
    legwear: "\u76AE\u8D28\u957F\u62A4\u817F",
    shoes: "\u9AD8\u8DDF\u957F\u7B52\u9774",
    accessory: "\u989D\u9970\u5C16\u89D2\u51A0, \u6307\u7532\u7F00\u91D1\u5C5E\u5C16\u5957, \u8170\u94FE\u5782\u9AA8\u9970"
  }, ["29-38", "39-50"]),
  c2("wld-xx-female-ancestor", "\u8001\u7956\u5A46\u5A46", "female", ["xianxia"], ["\u8001\u7956", "\u5A46\u5A46", "\u8004\u800B", "\u6DF1\u4E0D\u53EF\u6D4B", "\u4ED9\u4FA0"], "\u8F88\u5206\u6781\u9AD8\u7684\u8001\u7956, \u8863\u7740\u7D20\u5230\u6781\u81F4, \u552F\u62D0\u6756\u4E0E\u4E00\u652F\u65E7\u7C2A\u4E0D\u6362\u3002", {
    inner: "\u5BBD\u8212\u4E2D\u8863",
    top: "\u4EA4\u9886\u957F\u8966, \u8863\u8EAB\u5BBD\u5927\u65E0\u6536\u8170, \u901A\u4F53\u7D20\u9762",
    bottom: "\u9614\u5E45\u957F\u88D9, \u4E0B\u6446\u5806\u53E0\u5728\u8DB3\u9762",
    outerwear: "\u539A\u62AB\u98CE, \u9886\u53E3\u4E00\u5708\u6BDB\u7F18",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u5C65",
    accessory: "\u53D1\u9AFB\u4F4E\u633D\u63D2\u4E00\u652F\u65E7\u6728\u7C2A, \u624B\u6301\u85E4\u6756, \u8155\u6302\u5FF5\u73E0"
  }, ["66-80", "80+"]),
  c2("wld-xx-female-attendant", "\u4F8D\u5251\u5A62", "female", ["xianxia"], ["\u4F8D\u5973", "\u4F8D\u5251", "\u5C11\u5973", "\u606D\u8C28", "\u4ED9\u4FA0"], "\u8DDF\u5728\u4E3B\u4E0A\u8EAB\u4FA7\u6367\u5251\u7684\u4F8D\u5973, \u5236\u5F0F\u7EDF\u4E00\u3001\u8863\u957F\u53CA\u819D, \u65E0\u4EFB\u4F55\u79C1\u4EBA\u9970\u7269\u3002", {
    inner: "\u7D20\u4E2D\u8863, \u9886\u53E3\u8D34\u9888, \u8896\u53E3\u6536\u7D27\u4FBF\u4E8E\u6367\u7269",
    top: "\u7A84\u8896\u77ED\u8966, \u8863\u957F\u53CA\u8170, \u7CFB\u5E26\u5728\u4FA7",
    bottom: "\u53CA\u819D\u77ED\u88D9, \u5185\u886C\u675F\u53E3\u88E4",
    outerwear: "\u5BF9\u895F\u5C0F\u7F69\u886B",
    legwear: "\u5E03\u889C, \u889C\u7B52\u5E73\u6574, \u6536\u5728\u978B\u53E3\u5185",
    shoes: "\u5E73\u5E95\u8F6F\u978B, \u978B\u5E95\u8F7B\u8584, \u968F\u884C\u65F6\u6B65\u58F0\u6781\u8F7B",
    accessory: "\u53CC\u4E2B\u9AFB\u7CFB\u7D20\u7EF3, \u53CC\u624B\u5E38\u6367\u5251\u5323"
  }, ["16-20"]),
  c2("wld-xx-female-spirit", "\u5668\u7075\u5316\u5F62", "female", ["xianxia"], ["\u5668\u7075", "\u5251\u7075", "\u975E\u4EBA", "\u7A7A\u7075", "\u4ED9\u4FA0"], "\u7531\u6CD5\u5668\u5316\u5F62\u7684\u7075\u4F53, \u8863\u8EAB\u8FD1\u4E4E\u65E0\u7F1D\u3001\u65E0\u6263\u65E0\u5E26, \u8FB9\u7F18\u5904\u7406\u6210\u6E10\u9690\u865A\u5316\u3002", {
    inner: "\u4E00\u4F53\u5F0F\u8D34\u8EAB\u8863, \u65E0\u63A5\u7F1D",
    top: "\u7F69\u8EAB\u8F7B\u7EB1, \u81EA\u9888\u5782\u843D, \u8FB9\u7F18\u4F5C\u7834\u788E\u7FBD\u72B6",
    bottom: "\u957F\u88D9\u4E0B\u6446\u6E10\u6E10\u865A\u5316, \u4E0D\u89C1\u8DB3\u8E1D",
    outerwear: "\u60AC\u6D6E\u5F0F\u62AB\u7EB1, \u4E0D\u8D34\u8EAB, \u968F\u7075\u529B\u6D6E\u52A8",
    legwear: "\u65E0",
    shoes: "\u8D64\u8DB3, \u8DB3\u4E0D\u6CBE\u5730",
    accessory: "\u53D1\u68A2\u4E0E\u8863\u7F18\u6563\u843D\u7EC6\u788E\u5149\u70B9, \u989D\u5FC3\u4E00\u9053\u5668\u7EB9"
  }, ["16-20", "21-28"]),
  c2("wld-xx-female-array-master", "\u9635\u4FEE\u5973\u4FEE", "female", ["xianxia"], ["\u9635\u4FEE", "\u5973\u4FEE", "\u7F1C\u5BC6", "\u5B66\u8005", "\u4ED9\u4FA0"], "\u5E03\u9635\u63A8\u6F14\u7684\u5973\u4FEE, \u8863\u8EAB\u6EE1\u662F\u51E0\u4F55\u7EBF\u6761\u7EB9, \u968F\u8EAB\u5E26\u5C3A\u89C4\u4E0E\u9635\u65D7\u3002", {
    inner: "\u9AD8\u9886\u5185\u886C",
    top: "\u4EA4\u9886\u4E0A\u8863, \u8863\u8EAB\u7EC7\u89C4\u6574\u51E0\u4F55\u7EBF\u7EB9, \u8896\u53E3\u6536\u7A84",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u4FBF\u4E8E\u8E72\u8EAB\u5E03\u9635",
    outerwear: "\u53CA\u819D\u77ED\u888D, \u524D\u895F\u6392\u5217\u4E00\u5217\u7EC6\u53E3\u888B",
    legwear: "\u8584\u7ED1\u817F",
    shoes: "\u5E73\u5E95\u8F6F\u9774",
    accessory: "\u4F4E\u9AFB\u63D2\u4E00\u652F\u5C3A\u5F62\u7C2A, \u8170\u60AC\u9635\u65D7\u675F\u4E0E\u7F57\u76D8"
  }, ["29-38", "39-50"]),
  // ================= 玄幻 / 西幻(fantasy) =================
  c2("wld-fan-male-knight", "\u9A91\u58EB\u677F\u7532", "male", ["fantasy"], ["\u9A91\u58EB", "\u6218\u58EB", "\u897F\u5E7B", "\u6B63\u7EDF", "\u7384\u5E7B"], "\u53D7\u5C01\u7684\u6B63\u7EDF\u9A91\u58EB, \u6574\u5E45\u677F\u7532\u8986\u76D6\u5168\u8EAB, \u7532\u9762\u629B\u5149\u540E\u4ECD\u7559\u4E0B\u6218\u6597\u522E\u75D5\u3002", {
    inner: "\u9501\u5B50\u8F6F\u7532\u5185\u886C, \u8986\u81F3\u8098\u90E8",
    top: "\u6574\u5E45\u80F8\u7532, \u524D\u80F8\u538B\u5BB6\u5FBD\u6D6E\u96D5, \u80A9\u7532\u5448\u5C42\u53E0\u5F27\u7247",
    bottom: "\u817F\u7532\u5206\u7247\u5305\u8986, \u5173\u8282\u5904\u9732\u9501\u73AF",
    outerwear: "\u7F69\u888D\u62AB\u4E8E\u7532\u5916, \u524D\u540E\u5782\u5760, \u7EC7\u5BB6\u65CF\u7EB9\u7AE0",
    legwear: "\u9501\u73AF\u62A4\u817F",
    shoes: "\u94C1\u5934\u6218\u9774, \u9774\u8DDF\u5E26\u9A6C\u523A",
    accessory: "\u8170\u675F\u76AE\u9769\u5251\u5E26, \u81C2\u7F1A\u62A4\u8155, \u5934\u76D4\u631F\u4E8E\u81C2\u5F2F"
  }, ["21-28", "29-38"]),
  c2("wld-fan-male-paladin", "\u5723\u6BBF\u6B66\u50E7", "male", ["fantasy"], ["\u5723\u6BBF", "\u6B66\u50E7", "\u4FE1\u4EF0", "\u897F\u5E7B", "\u7384\u5E7B"], "\u4F8D\u5949\u4FE1\u4EF0\u7684\u6218\u6597\u50E7\u4FA3, \u7532\u4E0E\u888D\u5404\u534A, \u5723\u5FBD\u662F\u5168\u8EAB\u6700\u91CD\u7684\u88C5\u9970\u3002", {
    inner: "\u9AD8\u9886\u957F\u888D\u5185\u886C, \u9886\u53E3\u6263\u81F3\u9888",
    top: "\u534A\u8EAB\u80F8\u7532\u7F69\u4E8E\u888D\u5916, \u4E2D\u592E\u5D4C\u4E00\u679A\u5706\u5F62\u5723\u5FBD",
    bottom: "\u53CA\u8E1D\u957F\u888D\u4E0B\u6446, \u884C\u8D70\u65F6\u5206\u5F00\u9732\u51FA\u62A4\u80EB",
    outerwear: "\u5E26\u515C\u5E3D\u7684\u539A\u91CD\u5916\u888D, \u80A9\u7EBF\u5BBD\u5E73",
    legwear: "\u9501\u73AF\u62A4\u80EB",
    shoes: "\u539A\u5E95\u76AE\u9774",
    accessory: "\u9888\u6302\u5723\u5FBD\u94FE, \u8170\u675F\u7EF3\u7ED3\u8170\u5E26, \u624B\u6301\u957F\u67C4\u9524"
  }, ["29-38", "39-50"]),
  c2("wld-fan-male-mage", "\u6CD5\u5E08\u957F\u888D", "male", ["fantasy"], ["\u6CD5\u5E08", "\u65BD\u6CD5\u8005", "\u5B66\u8005", "\u897F\u5E7B", "\u7384\u5E7B"], "\u5854\u4E2D\u4FEE\u4E60\u7684\u6CD5\u5E08, \u888D\u8EAB\u5BBD\u5927\u3001\u5185\u886C\u7F1D\u6EE1\u53E3\u888B, \u8896\u7F18\u7EC7\u7B26\u6587\u5E26\u3002", {
    inner: "\u7D20\u957F\u886C\u888D",
    top: "\u53CA\u5730\u6CD5\u888D, \u8896\u5E45\u6781\u9614, \u8896\u7F18\u7EC7\u4E00\u5708\u7B26\u6587\u5E26",
    bottom: "\u888D\u5185\u957F\u88E4, \u4FBF\u4E8E\u767B\u5854\u9636",
    outerwear: "\u5E26\u515C\u5E3D\u5916\u888D, \u515C\u5E3D\u6781\u6DF1, \u906E\u4F4F\u4E0A\u534A\u5F20\u8138",
    legwear: "\u539A\u5E03\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u9774, \u9774\u5E2E\u67D4\u8F6F\u65E0\u58F0",
    accessory: "\u624B\u6301\u9876\u7AEF\u5D4C\u77F3\u7684\u957F\u6756, \u8170\u60AC\u5377\u8F74\u7B52\u4E0E\u836F\u74F6"
  }, ["29-38", "39-50"]),
  c2("wld-fan-male-rogue", "\u76D7\u8D3C\u6E38\u4FA0", "male", ["fantasy"], ["\u76D7\u8D3C", "\u6E38\u4FA0", "\u6F5C\u884C", "\u897F\u5E7B", "\u7384\u5E7B"], "\u9760\u6F5C\u884C\u5403\u996D\u7684\u6E38\u4FA0, \u4E00\u8EAB\u76AE\u9769\u4E0E\u6697\u888B, \u65E0\u4E00\u5904\u4F1A\u53D1\u51FA\u58F0\u54CD\u3002", {
    inner: "\u8D34\u8EAB\u7A84\u8896\u5185\u886C",
    top: "\u8F7B\u76AE\u7532\u80CC\u5FC3, \u524D\u895F\u6392\u5217\u591A\u4E2A\u6697\u888B, \u675F\u5E26\u4EA4\u53C9",
    bottom: "\u7D27\u8EAB\u957F\u88E4, \u5927\u817F\u5916\u4FA7\u7ED1\u5200\u9798",
    outerwear: "\u5E26\u515C\u5E3D\u77ED\u6597\u7BF7, \u957F\u5EA6\u4EC5\u53CA\u8170, \u4E0D\u59A8\u788D\u624B\u81C2",
    legwear: "\u76AE\u8D28\u7ED1\u817F",
    shoes: "\u8F6F\u5E95\u6F5C\u884C\u9774, \u978B\u5E95\u65E0\u9489",
    accessory: "\u9762\u8986\u534A\u5E45\u906E\u5DFE, \u8170\u7F20\u5F00\u9501\u5DE5\u5177\u5377"
  }, ["21-28", "29-38"]),
  c2("wld-fan-male-orc-warrior", "\u517D\u65CF\u6218\u58EB", "male", ["fantasy"], ["\u517D\u65CF", "\u6218\u58EB", "\u86EE\u8352", "\u897F\u5E7B", "\u7384\u5E7B"], "\u4F53\u683C\u8FDC\u8D85\u5E38\u4EBA\u7684\u517D\u65CF\u6218\u58EB, \u7532\u7247\u7C97\u7CD9\u3001\u7F1D\u7EBF\u5916\u9732, \u517D\u9AA8\u5373\u52CB\u7AE0\u3002", {
    inner: "\u65E0\u4E0A\u8863, \u4EC5\u7F20\u80F8\u5E03\u5E26",
    top: "\u7C97\u5236\u76AE\u7532\u80A9\u7F69, \u5355\u80A9\u8986\u76D6, \u94C6\u9489\u7C97\u5927",
    bottom: "\u517D\u76AE\u6218\u88D9, \u5206\u6761\u5782\u5760",
    outerwear: "\u6574\u5F20\u517D\u76AE\u62AB\u98CE, \u517D\u9996\u642D\u5728\u80A9\u5934",
    legwear: "\u76AE\u7EF3\u4EA4\u53C9\u7F20\u81F3\u819D",
    shoes: "\u539A\u5E95\u517D\u76AE\u9774, \u978B\u53E3\u7FFB\u6BDB",
    accessory: "\u9888\u6302\u5DE8\u517D\u7259\u4E32, \u81C2\u7F1A\u9AA8\u73AF, \u80CC\u8D1F\u5DE8\u65A7"
  }, ["29-38", "39-50"]),
  c2("wld-fan-male-elf-archer", "\u7CBE\u7075\u5C04\u624B", "male", ["fantasy"], ["\u7CBE\u7075", "\u5C04\u624B", "\u6797\u5730", "\u8F7B\u76C8", "\u7384\u5E7B"], "\u6797\u4E2D\u65CF\u88D4\u7684\u5C04\u624B, \u8863\u6599\u8F7B\u8584\u8D34\u8EAB\u3001\u53F6\u8109\u7EB9\u4E0E\u85E4\u7F16\u4EA4\u7EC7, \u5168\u8EAB\u4E0D\u5E26\u91D1\u5C5E\u58F0\u54CD\u3002", {
    inner: "\u8D34\u8EAB\u8F6F\u8D28\u5185\u886C",
    top: "\u659C\u895F\u77ED\u4E0A\u8863, \u8863\u8EAB\u538B\u53F6\u8109\u6697\u7EB9, \u8170\u675F\u7EC6\u7EE6",
    bottom: "\u4FEE\u8EAB\u957F\u88E4, \u819D\u90E8\u7F1D\u8F6F\u57AB",
    outerwear: "\u53CA\u819D\u65E0\u8896\u957F\u7F69\u8863, \u4E24\u4FA7\u5F00\u8869\u81F3\u80EF",
    legwear: "\u85E4\u7F16\u7ED1\u817F",
    shoes: "\u8F6F\u5E95\u77ED\u9774, \u9774\u53E3\u7F00\u53F6\u5F62\u6263",
    accessory: "\u957F\u53D1\u7F16\u6210\u6570\u80A1\u7EC6\u8FAB, \u80CC\u8D1F\u957F\u5F13\u4E0E\u7BAD\u888B"
  }, ["21-28", "29-38"]),
  c2("wld-fan-male-vampire-noble", "\u8840\u65CF\u8D35\u65CF", "male", ["fantasy"], ["\u8840\u65CF", "\u8D35\u65CF", "\u4F18\u96C5", "\u897F\u5E7B", "\u7384\u5E7B"], "\u6D3B\u4E86\u5F88\u4E45\u7684\u8840\u65CF, \u7A7F\u65E7\u65F6\u4EE3\u7684\u793C\u670D\u5F62\u5236, \u7ACB\u9886\u4E0E\u6597\u7BF7\u662F\u6807\u5FD7\u3002", {
    inner: "\u8377\u53F6\u8FB9\u9886\u886C\u886B, \u9886\u53E3\u9AD8\u7AD6",
    top: "\u53CC\u6392\u6263\u957F\u793C\u670D\u4E0A\u8863, \u6536\u8170\u6781\u7D27, \u540E\u6446\u5206\u71D5\u5C3E",
    bottom: "\u7B14\u633A\u957F\u897F\u88E4, \u88E4\u7EBF\u950B\u5229",
    outerwear: "\u53CA\u5730\u6597\u7BF7, \u7ACB\u9886\u7AD6\u81F3\u8033\u540E, \u5185\u886C\u53E6\u63A5\u4E00\u5C42",
    legwear: "\u957F\u7B52\u4E1D\u889C\u5F0F\u62A4\u817F",
    shoes: "\u5C16\u5934\u6F06\u9762\u76AE\u978B",
    accessory: "\u9886\u53E3\u7CFB\u5BBD\u9886\u5DFE\u5E76\u522B\u4E00\u679A\u5B9D\u77F3\u80F8\u9488, \u6307\u6234\u5BB6\u65CF\u6212"
  }, ["29-38", "39-50"]),
  c2("wld-fan-male-lord", "\u5F02\u4E16\u9886\u4E3B", "male", ["fantasy"], ["\u9886\u4E3B", "\u8D35\u65CF", "\u7EDF\u6CBB", "\u897F\u5E7B", "\u7384\u5E7B"], "\u4E00\u65B9\u5C01\u5730\u7684\u9886\u4E3B, \u793C\u670D\u4E0E\u8F7B\u7532\u6DF7\u7A7F, \u6BDB\u9886\u4E0E\u5BB6\u5FBD\u662F\u6743\u529B\u7B26\u53F7\u3002", {
    inner: "\u7EC6\u4E9A\u9EBB\u886C\u8863, \u8896\u53E3\u4F5C\u8936",
    top: "\u539A\u7ED2\u5916\u5957, \u524D\u895F\u6392\u4E00\u5217\u91D1\u5C5E\u6263, \u80A9\u7EBF\u52A0\u5BBD",
    bottom: "\u539A\u6599\u9A6C\u88E4, \u819D\u4E0B\u6536\u7D27",
    outerwear: "\u6BDB\u9886\u957F\u6597\u7BF7, \u5355\u80A9\u7528\u94FE\u6263\u56FA\u5B9A",
    legwear: "\u76AE\u8D28\u957F\u62A4\u817F",
    shoes: "\u9AD8\u7B52\u9A91\u9774, \u9774\u53E3\u7FFB\u5377",
    accessory: "\u8170\u675F\u5BBD\u76AE\u5E26\u6302\u5BB6\u5FBD\u6263, \u624B\u6234\u76AE\u8D28\u534A\u6307\u624B\u5957"
  }, ["39-50", "51-65"]),
  c2("wld-fan-male-alchemist", "\u70BC\u91D1\u672F\u58EB", "male", ["fantasy"], ["\u70BC\u91D1", "\u672F\u58EB", "\u94BB\u7814", "\u897F\u5E7B", "\u7384\u5E7B"], "\u6210\u65E5\u6CE1\u5728\u5769\u57DA\u65C1\u7684\u70BC\u91D1\u672F\u58EB, \u76AE\u56F4\u88D9\u4E0E\u62A4\u76EE\u955C\u4E0D\u79BB\u8EAB, \u8896\u53E3\u5168\u662F\u707C\u75D5\u3002", {
    inner: "\u5377\u8896\u886C\u886B, \u8896\u53E3\u633D\u81F3\u8098\u4E0A",
    top: "\u591A\u53E3\u888B\u80CC\u5FC3, \u6BCF\u4E2A\u53E3\u888B\u63D2\u4E0D\u540C\u5DE5\u5177",
    bottom: "\u8010\u78E8\u5DE5\u88C5\u957F\u88E4",
    outerwear: "\u539A\u76AE\u56F4\u88D9, \u81EA\u80F8\u81F3\u819D, \u5E03\u6EE1\u707C\u75D5\u4E0E\u9178\u8680\u70B9",
    legwear: "\u539A\u5E03\u889C",
    shoes: "\u786C\u5E95\u5DE5\u978B",
    accessory: "\u8170\u6302\u8BD5\u5242\u74F6\u67B6, \u989D\u9876\u63A8\u8D77\u7684\u62A4\u76EE\u955C(\u975E\u5FC5\u8981\u65F6\u7701\u7565)"
  }, ["39-50", "51-65"]),
  c2("wld-fan-male-necromancer", "\u4EA1\u7075\u6CD5\u5E08", "male", ["fantasy"], ["\u4EA1\u7075", "\u6CD5\u5E08", "\u9634\u90C1", "\u897F\u5E7B", "\u7384\u5E7B"], "\u4E0E\u4EA1\u8005\u6253\u4EA4\u9053\u7684\u6CD5\u5E08, \u888D\u8EAB\u8934\u891B\u4F5C\u7834\u8FB9\u5904\u7406, \u9AA8\u5236\u9970\u7269\u6210\u4E32\u3002", {
    inner: "\u8D34\u8EAB\u957F\u5185\u888D",
    top: "\u4EA4\u53E0\u5F0F\u957F\u888D, \u4E0B\u6446\u6495\u88C2\u6210\u6761\u72B6, \u8FB9\u7F18\u4E0D\u7F1D\u5408",
    bottom: "\u888D\u5185\u7A84\u817F\u957F\u88E4",
    outerwear: "\u5E26\u6781\u6DF1\u515C\u5E3D\u7684\u7834\u635F\u5916\u888D, \u80A9\u90E8\u7F00\u9AA8\u7247",
    legwear: "\u5E03\u6761\u7F20\u817F",
    shoes: "\u8F6F\u5E95\u65E7\u9774, \u978B\u5934\u5F00\u88C2",
    accessory: "\u9888\u6302\u9AA8\u73E0\u4E32, \u624B\u6301\u9876\u7AEF\u5D4C\u5934\u9AA8\u7684\u6CD5\u6756"
  }, ["29-38", "39-50"]),
  c2("wld-fan-female-knight", "\u5973\u9A91\u58EB\u8F7B\u7532", "female", ["fantasy"], ["\u5973\u9A91\u58EB", "\u6218\u58EB", "\u82F1\u6C14", "\u897F\u5E7B", "\u7384\u5E7B"], "\u6218\u573A\u4E0A\u7684\u5973\u9A91\u58EB, \u7532\u7247\u8D34\u5408\u8EAB\u5F62\u4F46\u4E0D\u4F5C\u5938\u5F20\u6536\u8170, \u5B9E\u7528\u538B\u8FC7\u89C2\u8D4F\u3002", {
    inner: "\u9501\u73AF\u8F6F\u7532\u5185\u886C",
    top: "\u5408\u8EAB\u80F8\u7532, \u8170\u4FA7\u7559\u6D3B\u52A8\u7F1D, \u80A9\u7532\u5448\u5F27\u7247",
    bottom: "\u7532\u88D9\u5206\u7247\u5782\u81F3\u819D, \u5185\u886C\u7D27\u8EAB\u88E4",
    outerwear: "\u7F69\u888D\u62AB\u4E8E\u7532\u5916, \u7EC7\u7EB9\u7AE0",
    legwear: "\u9501\u73AF\u62A4\u80EB",
    shoes: "\u9AD8\u7B52\u6218\u9774",
    accessory: "\u957F\u53D1\u7F16\u6210\u7D27\u5B9E\u53D1\u8FAB\u76D8\u4E8E\u8111\u540E, \u8170\u675F\u5251\u5E26"
  }, ["21-28", "29-38"]),
  c2("wld-fan-female-mage", "\u5973\u6CD5\u5E08\u6CD5\u888D", "female", ["fantasy"], ["\u5973\u6CD5\u5E08", "\u65BD\u6CD5\u8005", "\u795E\u79D8", "\u897F\u5E7B", "\u7384\u5E7B"], "\u5973\u6027\u65BD\u6CD5\u8005, \u888D\u8EAB\u4FEE\u957F\u8D34\u5408\u3001\u8896\u5E45\u5F20\u5F00, \u7B26\u6587\u6CBF\u8863\u7F18\u8D70\u4E00\u6574\u5708\u3002", {
    inner: "\u8D34\u8EAB\u957F\u5185\u886C",
    top: "\u6536\u8170\u957F\u888D, \u9886\u53E3\u4F5C\u6DF1 V, \u8863\u7F18\u7EC7\u8FDE\u7EED\u7B26\u6587",
    bottom: "\u957F\u888D\u4E0B\u6446\u5F00\u8869\u81F3\u5927\u817F, \u5185\u886C\u4FEE\u8EAB\u957F\u88E4",
    outerwear: "\u534A\u900F\u5916\u7EB1, \u81EA\u80A9\u5782\u843D\u53CA\u5730",
    legwear: "\u957F\u7B52\u62A4\u817F",
    shoes: "\u7EC6\u8DDF\u77ED\u9774",
    accessory: "\u624B\u6301\u77ED\u6756, \u989D\u9970\u4E00\u679A\u9576\u77F3\u62B9\u989D, \u8155\u60AC\u7B26\u6587\u73AF"
  }, ["21-28", "29-38"]),
  c2("wld-fan-female-priestess", "\u795E\u6BBF\u5973\u796D\u53F8", "female", ["fantasy"], ["\u796D\u53F8", "\u795E\u6BBF", "\u5723\u6D01", "\u897F\u5E7B", "\u7384\u5E7B"], "\u795E\u6BBF\u4F9B\u804C\u7684\u5973\u796D\u53F8, \u5C42\u7EB1\u53E0\u7F69\u3001\u7EB9\u6837\u5BF9\u79F0, \u4E3E\u6B62\u7AEF\u5E84\u4E0D\u9732\u808C\u80A4\u3002", {
    inner: "\u9AD8\u9886\u957F\u5185\u888D",
    top: "\u7F69\u888D\u4E0A\u8EAB\u5408\u4F53, \u80A9\u8986\u5BF9\u79F0\u62AB\u80A9, \u4E2D\u592E\u5D4C\u5723\u5FBD",
    bottom: "\u53CA\u5730\u957F\u88D9, \u88D9\u5E45\u6781\u5BBD, \u884C\u8D70\u65F6\u5448\u949F\u5F62",
    outerwear: "\u8584\u7EB1\u5916\u7F69\u81EA\u80A9\u5782\u843D, \u8FB9\u7F18\u7F00\u7EC6\u6D41\u82CF",
    legwear: "\u957F\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u5C65",
    accessory: "\u5934\u6234\u5782\u7EB1\u51A0, \u9888\u6302\u957F\u94FE\u5723\u5FBD, \u624B\u6301\u5723\u5178"
  }, ["21-28", "29-38"]),
  c2("wld-fan-female-druid", "\u5FB7\u9C81\u4F0A", "female", ["fantasy"], ["\u5FB7\u9C81\u4F0A", "\u81EA\u7136", "\u6797\u5730", "\u897F\u5E7B", "\u7384\u5E7B"], "\u4E0E\u81EA\u7136\u5171\u5904\u7684\u5FB7\u9C81\u4F0A, \u8863\u6599\u662F\u9EBB\u4E0E\u85E4\u7F16, \u5934\u9970\u7528\u771F\u5B9E\u679D\u53F6\u3002", {
    inner: "\u7C97\u9EBB\u8D34\u8EAB\u5185\u886C",
    top: "\u4EA4\u53E0\u5F0F\u9EBB\u5E03\u4E0A\u8863, \u7CFB\u5E26\u5728\u8170\u4FA7, \u80A9\u62AB\u85E4\u7F16\u7F51",
    bottom: "\u4E0D\u89C4\u5219\u88C1\u8FB9\u957F\u88D9, \u4E0B\u6446\u4F5C\u53C2\u5DEE\u72B6",
    outerwear: "\u82D4\u85D3\u8D28\u611F\u62AB\u80A9, \u9886\u53E3\u7F00\u679D\u6761",
    legwear: "\u9EBB\u7EF3\u7F20\u817F\u81F3\u819D",
    shoes: "\u8D64\u8DB3\u6216\u85E4\u7F16\u51C9\u5C65",
    accessory: "\u53D1\u95F4\u7F16\u5165\u679D\u53F6\u4E0E\u6D46\u679C, \u624B\u6301\u5F2F\u66F2\u6728\u6756"
  }, ["39-50", "51-65"]),
  c2("wld-fan-female-beastkin", "\u517D\u8033\u65CF\u5C11\u5973", "female", ["fantasy"], ["\u517D\u65CF", "\u5C11\u5973", "\u7075\u52A8", "\u897F\u5E7B", "\u7384\u5E7B"], "\u517D\u8033\u65CF\u7684\u5E74\u8F7B\u59D1\u5A18, \u8863\u7740\u77ED\u5C0F\u4FBF\u4E8E\u7A9C\u8DF3, \u5C3E\u5DF4\u4E0E\u8033\u6735\u662F\u672C\u4F53\u7684\u4E00\u90E8\u5206\u3002", {
    inner: "\u8D34\u8EAB\u62B9\u80F8\u5185\u886C",
    top: "\u77ED\u6B3E\u7CFB\u5E26\u4E0A\u8863, \u9732\u8170\u4E00\u622A, \u8896\u53E3\u4F5C\u84EC\u677E\u72B6",
    bottom: "\u4E0D\u89C4\u5219\u88C1\u8FB9\u77ED\u88D9, \u5185\u886C\u5B89\u5168\u88E4",
    outerwear: "\u6BDB\u7F18\u77ED\u62AB\u80A9, \u6302\u5728\u5355\u80A9",
    legwear: "\u8FC7\u819D\u957F\u889C, \u889C\u53E3\u6709\u4E00\u5708\u7ED2\u6BDB",
    shoes: "\u8F6F\u5E95\u77ED\u9774, \u9774\u53E3\u7FFB\u7ED2",
    accessory: "\u5934\u9876\u517D\u8033, \u8EAB\u540E\u957F\u5C3E, \u9888\u7CFB\u94C3\u94DB\u9879\u5708"
  }, ["16-20", "21-28"]),
  c2("wld-fan-female-witch", "\u8001\u5DEB\u5973", "female", ["fantasy"], ["\u5DEB\u5973", "\u8001\u59AA", "\u8BE1\u8C32", "\u897F\u5E7B", "\u7384\u5E7B"], "\u4F4F\u5728\u6797\u6DF1\u5904\u7684\u8001\u5DEB\u5973, \u5C42\u5C42\u65E7\u5E03\u88F9\u8EAB, \u6302\u6EE1\u5E72\u8349\u836F\u4E0E\u9AA8\u7B26\u3002", {
    inner: "\u591A\u5C42\u65E7\u5E03\u5185\u886C, \u957F\u77ED\u4E0D\u4E00",
    top: "\u5BBD\u5927\u957F\u888D, \u5E03\u6599\u62FC\u63A5, \u8865\u4E01\u645E\u8865\u4E01",
    bottom: "\u62D6\u5730\u957F\u88D9, \u4E0B\u6446\u6CBE\u6EE1\u6797\u5730\u788E\u5C51",
    outerwear: "\u5E26\u5C16\u9876\u515C\u5E3D\u7684\u539A\u62AB\u98CE, \u8FB9\u7F18\u78E8\u6210\u6BDB\u987B",
    legwear: "\u539A\u5E03\u7F20\u817F",
    shoes: "\u5F00\u88C2\u65E7\u9774, \u9774\u5E2E\u7528\u7EF3\u6346\u4F4F",
    accessory: "\u8170\u95F4\u6302\u6EE1\u5E72\u8349\u836F\u675F\u4E0E\u9AA8\u7B26, \u624B\u6301\u6B6A\u66F2\u6728\u6756"
  }, ["51-65", "66-80"]),
  // ================= 异国古装(欧洲 / 东亚 / 中亚) =================
  c2("wld-eu-male-medieval-lord", "\u4E2D\u4E16\u7EAA\u9886\u4E3B", "male", ["ancient", "fantasy"], ["\u9886\u4E3B", "\u6B27\u6D32", "\u897F\u5F0F", "\u4E2D\u4E16\u7EAA", "\u8D35\u65CF"], "\u6B27\u6D32\u4E2D\u4E16\u7EAA\u7684\u5C01\u5730\u9886\u4E3B, \u539A\u7ED2\u5916\u5957\u4E0E\u6BDB\u9886\u6597\u7BF7, \u5BB6\u5FBD\u5904\u5904\u53EF\u89C1\u3002", {
    inner: "\u4E9A\u9EBB\u886C\u8863, \u9886\u53E3\u7CFB\u7EC6\u7EF3",
    top: "\u53CA\u819D\u539A\u7ED2\u5916\u888D, \u524D\u895F\u7EE3\u5BB6\u5FBD, \u8170\u675F\u5BBD\u76AE\u5E26",
    bottom: "\u7D27\u8EAB\u957F\u889C\u88E4, \u8D34\u5408\u817F\u578B",
    outerwear: "\u6BDB\u7F18\u6597\u7BF7, \u7528\u91D1\u5C5E\u642D\u6263\u56FA\u5B9A\u4E8E\u53F3\u80A9",
    legwear: "\u5E03\u8D28\u957F\u62A4\u817F",
    shoes: "\u5C16\u5934\u8F6F\u76AE\u978B",
    accessory: "\u8170\u6302\u94B1\u888B\u4E0E\u77ED\u5251, \u6307\u6234\u5370\u7AE0\u6212"
  }, ["39-50", "51-65"]),
  c2("wld-eu-male-medieval-villager", "\u4E2D\u4E16\u7EAA\u6751\u6C11", "male", ["ancient", "rural"], ["\u6751\u6C11", "\u6B27\u6D32", "\u897F\u5F0F", "\u4E2D\u4E16\u7EAA", "\u5E73\u6C11"], "\u6B27\u6D32\u6751\u843D\u7684\u666E\u901A\u519C\u4EBA, \u7C97\u9EBB\u675F\u8170\u4E0A\u8863\u914D\u957F\u889C\u88E4, \u5168\u8EAB\u65E0\u4E00\u5904\u88C5\u9970\u3002", {
    inner: "\u7C97\u9EBB\u5185\u886B",
    top: "\u53CA\u819D\u675F\u8170\u957F\u4E0A\u8863, \u9886\u53E3\u5F00\u4E00\u9053\u7CFB\u5E26, \u8896\u5B50\u5BBD\u677E",
    bottom: "\u7C97\u5E03\u957F\u889C\u88E4, \u819D\u4E0B\u7528\u5E03\u6761\u6346\u624E",
    outerwear: "\u5E26\u515C\u5E3D\u7684\u77ED\u6597\u7BF7, \u5E03\u9762\u8D77\u7403",
    legwear: "\u5E03\u6761\u7F20\u817F",
    shoes: "\u8F6F\u76AE\u5305\u811A\u978B, \u978B\u9762\u7528\u7EC6\u7EF3\u7CFB\u5408",
    accessory: "\u8170\u675F\u7EF3\u5E26\u6302\u76AE\u8D28\u6C34\u888B"
  }, ["29-38", "39-50"]),
  c2("wld-eu-male-victorian-gent", "\u7EF4\u591A\u5229\u4E9A\u7EC5\u58EB", "male", ["ancient"], ["\u7EC5\u58EB", "\u6B27\u6D32", "\u897F\u5F0F", "\u590D\u53E4", "\u793C\u670D"], "\u65E7\u6B27\u6D32\u7684\u4F53\u9762\u7EC5\u58EB, \u4E09\u4EF6\u5957\u52A0\u9AD8\u5E3D, \u6BCF\u4E00\u9897\u6263\u5B50\u90FD\u6263\u5230\u4F4D\u3002", {
    inner: "\u7ACB\u9886\u886C\u886B, \u9886\u5C16\u786C\u633A, \u7CFB\u5BBD\u9886\u7ED3",
    top: "\u5408\u4F53\u9A6C\u7532, \u524D\u895F\u6392\u4E00\u5217\u5C0F\u6263, \u540E\u80CC\u6709\u8C03\u8282\u5E26",
    bottom: "\u76F4\u7B52\u957F\u897F\u88E4, \u88E4\u7EBF\u7B14\u633A",
    outerwear: "\u957F\u793C\u670D\u5916\u5957, \u6536\u8170, \u540E\u6446\u5206\u5F00\u5448\u71D5\u5C3E",
    legwear: "\u957F\u7B52\u889C",
    shoes: "\u7CFB\u5E26\u9AD8\u5E2E\u76AE\u978B, \u978B\u9762\u6253\u8721",
    accessory: "\u9AD8\u7B52\u793C\u5E3D, \u9A6C\u7532\u53E3\u888B\u6302\u6000\u8868\u94FE, \u624B\u6301\u624B\u6756"
  }, ["29-38", "39-50"]),
  c2("wld-eu-female-victorian-lady", "\u7EF4\u591A\u5229\u4E9A\u6DD1\u5973", "female", ["ancient"], ["\u6DD1\u5973", "\u6B27\u6D32", "\u897F\u5F0F", "\u590D\u53E4", "\u793C\u88D9"], "\u65E7\u6B27\u6D32\u7684\u540D\u95E8\u5C0F\u59D0, \u675F\u8170\u52A0\u6491\u88D9, \u624B\u5957\u4E0E\u9633\u4F1E\u662F\u6807\u914D\u3002", {
    inner: "\u675F\u8170\u80F8\u8863, \u7CFB\u5E26\u5728\u540E",
    top: "\u5408\u4F53\u4E0A\u8EAB, \u9AD8\u9886\u6263\u81F3\u9888, \u8896\u53E3\u4F5C\u5C42\u53E0\u8377\u53F6\u8FB9",
    bottom: "\u6491\u67B6\u957F\u88D9, \u88D9\u5E45\u6781\u5BBD, \u4E0B\u6446\u7F00\u591A\u5C42\u857E\u4E1D",
    outerwear: "\u77ED\u6B3E\u6536\u8170\u5916\u62AB, \u4EC5\u53CA\u8170\u7EBF",
    legwear: "\u957F\u7B52\u4E1D\u889C",
    shoes: "\u7CFB\u5E26\u77ED\u8DDF\u9774, \u978B\u9762\u6392\u7EC6\u6263",
    accessory: "\u8FC7\u8098\u957F\u624B\u5957, \u624B\u6301\u857E\u4E1D\u9633\u4F1E, \u53D1\u9AFB\u7F00\u7FBD\u9970"
  }, ["21-28", "29-38"]),
  c2("wld-eu-female-court-noble", "\u5BAB\u5EF7\u8D35\u5987", "female", ["ancient"], ["\u8D35\u5987", "\u5BAB\u5EF7", "\u6B27\u6D32", "\u897F\u5F0F", "\u5962\u534E"], "\u6B27\u6D32\u5BAB\u5EF7\u91CC\u7684\u8D35\u5987, \u88D9\u6491\u6700\u5BBD\u3001\u5C42\u6570\u6700\u591A, \u73E0\u9970\u5806\u5230\u53D1\u9876\u3002", {
    inner: "\u786C\u8D28\u675F\u80F8, \u6536\u8170\u6781\u7D27",
    top: "\u4F4E\u9886\u4E0A\u8EAB, \u9886\u7F18\u7F00\u591A\u5C42\u8936\u8FB9, \u8896\u4F5C\u6CE1\u6CE1\u72B6",
    bottom: "\u5DE8\u5E45\u88D9\u6491\u957F\u88D9, \u524D\u7247\u5F00\u542F\u9732\u51FA\u5185\u886C\u88D9, \u6EE1\u7EE3\u7F20\u679D",
    outerwear: "\u66F3\u5730\u957F\u62D6\u88FE, \u81EA\u80A9\u540E\u5782\u843D",
    legwear: "\u4E1D\u8D28\u957F\u889C",
    shoes: "\u4E2D\u8DDF\u5BAB\u5EF7\u978B, \u978B\u9762\u7F00\u6263\u9970",
    accessory: "\u9AD8\u8038\u76D8\u53D1\u7F00\u73E0\u4E32\u4E0E\u7FBD\u6BDB, \u9888\u6234\u591A\u5C42\u9879\u94FE, \u6267\u6298\u6247"
  }, ["29-38", "39-50"]),
  c2("wld-eu-male-page", "\u5BAB\u5EF7\u4F8D\u4ECE\u5C11\u5E74", "male", ["ancient"], ["\u4F8D\u4ECE", "\u5C11\u5E74", "\u5BAB\u5EF7", "\u6B27\u6D32", "\u897F\u5F0F"], "\u8D35\u65CF\u8EAB\u8FB9\u8DD1\u817F\u7684\u5C11\u5E74\u4F8D\u4ECE, \u5236\u5F0F\u77ED\u4E0A\u8863\u52A0\u7D27\u8EAB\u88E4, \u5E72\u51C0\u5229\u843D\u3002", {
    inner: "\u7EC6\u4E9A\u9EBB\u886C\u8863, \u9886\u53E3\u4F5C\u5C0F\u8936",
    top: "\u5408\u4F53\u77ED\u4E0A\u8863, \u524D\u895F\u6392\u4E00\u5217\u5C0F\u6263, \u80A9\u7F00\u7EF3\u7ED3\u9970",
    bottom: "\u7D27\u8EAB\u53CA\u819D\u77ED\u88E4",
    outerwear: "\u534A\u8EAB\u5C0F\u62AB\u80A9, \u5355\u80A9\u56FA\u5B9A",
    legwear: "\u957F\u7B52\u889C, \u81F3\u819D\u4E0A",
    shoes: "\u642D\u6263\u6D45\u53E3\u978B",
    accessory: "\u6241\u5706\u8F6F\u5E3D, \u8170\u675F\u7A84\u76AE\u5E26"
  }, ["16-20"]),
  c2("wld-eu-female-nun", "\u4FEE\u5973\u670D", "female", ["ancient"], ["\u4FEE\u5973", "\u5B97\u6559", "\u6B27\u6D32", "\u897F\u5F0F", "\u7981\u6B32"], "\u4FEE\u9053\u9662\u7684\u4FEE\u5973, \u5934\u5DFE\u4E0E\u957F\u888D\u628A\u8EAB\u5F62\u5B8C\u5168\u906E\u4F4F, \u53EA\u4F59\u9762\u90E8\u4E0E\u53CC\u624B\u3002", {
    inner: "\u9AD8\u9886\u957F\u5185\u888D",
    top: "\u76F4\u7B52\u957F\u888D, \u901A\u4F53\u65E0\u6536\u8170, \u8896\u5E45\u5BBD\u5927",
    bottom: "\u957F\u888D\u4E0B\u6446\u53CA\u5730, \u884C\u8D70\u65F6\u4E0D\u89C1\u8DB3",
    outerwear: "\u80A9\u8986\u77ED\u62AB\u5DFE, \u524D\u540E\u5782\u5760",
    legwear: "\u539A\u957F\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u978B",
    accessory: "\u5934\u5DFE\u88F9\u4F4F\u53D1\u9645\u4E0E\u9888, \u8170\u675F\u7EF3\u7ED3\u6302\u5FF5\u73E0\u4E0E\u5341\u5B57\u9970"
  }, ["29-38", "39-50"]),
  c2("wld-eu-male-priest", "\u795E\u7236\u957F\u888D", "male", ["ancient"], ["\u795E\u7236", "\u5B97\u6559", "\u6B27\u6D32", "\u897F\u5F0F", "\u8083\u7A46"], "\u6559\u5802\u7684\u795E\u7236, \u957F\u888D\u4ECE\u9888\u6263\u5230\u811A\u8E1D, \u552F\u9886\u53E3\u4E00\u9053\u65B9\u5F62\u786C\u9886\u3002", {
    inner: "\u7ACB\u9886\u5185\u886C, \u9886\u53E3\u9732\u51FA\u4E00\u65B9\u786C\u9886",
    top: "\u76F4\u7B52\u957F\u888D, \u524D\u895F\u81EA\u9888\u81F3\u8E1D\u6392\u6EE1\u5C0F\u6263",
    bottom: "\u957F\u888D\u4E0B\u6446\u53CA\u8E1D",
    outerwear: "\u53CA\u819D\u77ED\u62AB\u98CE, \u9886\u53E3\u7528\u94FE\u6263\u56FA\u5B9A",
    legwear: "\u957F\u889C",
    shoes: "\u7CFB\u5E26\u76AE\u978B",
    accessory: "\u9888\u6302\u957F\u94FE\u5341\u5B57\u9970, \u624B\u6301\u76AE\u9762\u5723\u5178"
  }, ["39-50", "51-65"]),
  c2("wld-jp-male-samurai", "\u548C\u98CE\u6B66\u58EB", "male", ["ancient"], ["\u6B66\u58EB", "\u548C\u98CE", "\u4E1C\u701B", "\u5F02\u56FD", "\u53E4\u88C5"], "\u4E1C\u701B\u6B66\u58EB, \u4E0A\u8863\u5BBD\u80A9\u4E0B\u6446\u6536\u675F, \u8170\u95F4\u53CC\u5200\u662F\u8EAB\u4EFD\u672C\u8EAB\u3002", {
    inner: "\u4EA4\u9886\u5185\u886C, \u7CFB\u5E26\u5728\u4FA7",
    top: "\u5BBD\u80A9\u4E0A\u8863, \u80A9\u7EBF\u5448\u786C\u7FFC\u72B6\u5411\u5916\u5F20\u5F00",
    bottom: "\u5BBD\u5E45\u8936\u88E4, \u524D\u540E\u5404\u6392\u6DF1\u8936, \u88E4\u811A\u6536\u7D27",
    outerwear: "\u77ED\u5916\u8902, \u80CC\u4E2D\u7F00\u5BB6\u7EB9\u4E00\u679A",
    legwear: "\u5206\u8DBE\u5E03\u889C",
    shoes: "\u6728\u5C50\u6216\u8349\u7F16\u51C9\u5C65",
    accessory: "\u53D1\u9876\u7ED3\u9AFB, \u8170\u5E26\u63D2\u957F\u77ED\u53CC\u5200"
  }, ["29-38", "39-50"]),
  c2("wld-jp-female-townsgirl", "\u548C\u98CE\u753A\u5A18", "female", ["ancient"], ["\u753A\u5A18", "\u548C\u98CE", "\u4E1C\u701B", "\u5C11\u5973", "\u53E4\u88C5"], "\u5E02\u4E95\u4EBA\u5BB6\u7684\u59D1\u5A18, \u8863\u8EAB\u7D20\u51C0\u3001\u8170\u5E26\u7B80\u5355\u6253\u7ED3, \u8D70\u52A8\u65F6\u4E0B\u6446\u6536\u5F97\u7D27\u3002", {
    inner: "\u7D20\u8272\u8D34\u8EAB\u957F\u8966\u88A2",
    top: "\u4EA4\u9886\u957F\u8863, \u8863\u8EAB\u538B\u7EC6\u5BC6\u788E\u82B1\u7EB9, \u8896\u4F5C\u65B9\u5F62\u5782\u888B\u72B6",
    bottom: "\u8863\u8EAB\u4E0B\u6446\u5DE6\u53F3\u4EA4\u53E0, \u7528\u8170\u5E26\u56FA\u5B9A",
    outerwear: "\u77ED\u5916\u7F69, \u534A\u900F\u8584\u7EB1",
    legwear: "\u5206\u8DBE\u5E03\u889C",
    shoes: "\u5E73\u5E95\u8349\u7F16\u51C9\u5C65",
    accessory: "\u8170\u5E26\u5728\u8EAB\u540E\u6253\u6210\u65B9\u7ED3, \u53D1\u9AFB\u63D2\u4E00\u652F\u82B1\u7C2A"
  }, ["16-20", "21-28"]),
  c2("wld-jp-female-shrine", "\u795E\u793E\u5DEB\u5973", "female", ["ancient"], ["\u5DEB\u5973", "\u795E\u793E", "\u548C\u98CE", "\u5F02\u56FD", "\u53E4\u88C5"], "\u795E\u793E\u4F9B\u804C\u7684\u5DEB\u5973, \u4E0A\u4E0B\u4E24\u622A\u5206\u660E\u3001\u8896\u5E45\u6781\u5927, \u796D\u4EEA\u65F6\u4E0D\u7740\u4EFB\u4F55\u591A\u4F59\u9970\u7269\u3002", {
    inner: "\u7D20\u8272\u8D34\u8EAB\u5185\u886C",
    top: "\u4EA4\u9886\u4E0A\u8863, \u8896\u5E45\u6781\u9614, \u8896\u53E3\u5F00\u653E",
    bottom: "\u9AD8\u8170\u5BBD\u5E45\u8936\u88D9, \u7CFB\u5E26\u6781\u957F, \u524D\u540E\u5404\u6392\u6DF1\u8936",
    outerwear: "\u65E0\u5916\u5957\u5C42",
    legwear: "\u5206\u8DBE\u5E03\u889C",
    shoes: "\u6728\u5C50",
    accessory: "\u957F\u53D1\u5728\u8170\u9645\u7528\u4E00\u6BB5\u7EB8\u7EF3\u675F\u4F4F, \u624B\u6301\u94C3\u6756"
  }, ["16-20", "21-28"]),
  c2("wld-kr-female-hanbok", "\u97E9\u5F0F\u4E24\u73ED\u5973\u7737", "female", ["ancient"], ["\u4E24\u73ED", "\u97E9\u5F0F", "\u5F02\u56FD", "\u5973\u7737", "\u53E4\u88C5"], "\u534A\u5C9B\u65E7\u65F6\u7684\u8D35\u5BB6\u5973\u7737, \u77ED\u4E0A\u8863\u914D\u9AD8\u8170\u84EC\u88D9, \u4E0A\u7D27\u4E0B\u9614\u5BF9\u6BD4\u5F3A\u70C8\u3002", {
    inner: "\u8D34\u8EAB\u5185\u886C\u77ED\u8863",
    top: "\u6781\u77ED\u7684\u659C\u895F\u4E0A\u8863, \u8863\u957F\u4EC5\u53CA\u80F8\u4E0B, \u9886\u7F18\u53E6\u63A5\u4E00\u9053\u5BBD\u8FB9",
    bottom: "\u9AD8\u8170\u84EC\u677E\u957F\u88D9, \u81EA\u80F8\u4E0B\u8D77\u84EC\u5F00, \u88D9\u5E45\u6781\u5927",
    outerwear: "\u7F69\u4E8E\u5916\u7684\u957F\u5916\u888D, \u8896\u5E45\u5BBD\u5927",
    legwear: "\u5E03\u889C",
    shoes: "\u8239\u5F62\u7FD8\u5934\u7EE3\u978B",
    accessory: "\u80F8\u524D\u7CFB\u957F\u98D8\u5E26\u6253\u7ED3\u5782\u843D, \u53D1\u8FAB\u76D8\u8D77\u63D2\u957F\u7C2A"
  }, ["21-28", "29-38"]),
  c2("wld-kr-male-scholar", "\u97E9\u5F0F\u4E24\u73ED\u6587\u58EB", "male", ["ancient"], ["\u4E24\u73ED", "\u97E9\u5F0F", "\u6587\u58EB", "\u5F02\u56FD", "\u53E4\u88C5"], "\u534A\u5C9B\u65E7\u65F6\u7684\u8BFB\u4E66\u4EBA, \u5BBD\u888D\u5927\u8896\u914D\u9A6C\u5C3E\u7F16\u7EC7\u7684\u9AD8\u5E3D, \u4E3E\u6B62\u62D8\u8C28\u5B88\u793C\u3002", {
    inner: "\u4EA4\u9886\u5185\u886C, \u7CFB\u5E26\u5728\u4FA7",
    top: "\u5BBD\u8896\u957F\u888D, \u8863\u8EAB\u76F4\u7B52, \u8170\u675F\u5BBD\u5E26",
    bottom: "\u5BBD\u817F\u957F\u88E4, \u88E4\u811A\u7528\u5E03\u5E26\u624E\u4F4F",
    outerwear: "\u5916\u7F69\u534A\u900F\u957F\u888D, \u884C\u8D70\u65F6\u968F\u98CE\u5F20\u5F00",
    legwear: "\u5E03\u889C",
    shoes: "\u5E73\u5E95\u5E03\u5C65",
    accessory: "\u9A6C\u5C3E\u7F16\u7EC7\u7684\u9AD8\u7B52\u5E3D, \u988F\u4E0B\u7CFB\u7EC6\u7EF3"
  }, ["29-38", "39-50"]),
  c2("wld-me-male-merchant", "\u5546\u961F\u884C\u5546", "male", ["ancient"], ["\u5546\u961F", "\u884C\u5546", "\u4E2D\u4E9A", "\u5F02\u56FD", "\u53E4\u88C5"], "\u8D70\u6C99\u6F20\u5546\u9053\u7684\u884C\u5546, \u5C42\u5C42\u7F20\u88F9\u9632\u98CE\u6C99, \u8170\u95F4\u94B1\u888B\u4E0E\u8D27\u5355\u4E0D\u79BB\u8EAB\u3002", {
    inner: "\u5BBD\u677E\u957F\u5185\u888D, \u8896\u53E3\u655E\u5F00",
    top: "\u4EA4\u53E0\u5F0F\u957F\u888D, \u81EA\u5DE6\u80A9\u659C\u895F\u81F3\u53F3\u8170, \u8170\u675F\u957F\u5E03\u5E26\u7ED5\u6570\u5708",
    bottom: "\u5BBD\u817F\u706F\u7B3C\u88E4, \u811A\u8E1D\u5904\u6536\u7D27",
    outerwear: "\u539A\u7EC7\u5916\u888D, \u8FB9\u7F18\u7EC7\u51E0\u4F55\u7EB9\u5E26, \u80A9\u7EBF\u5BBD\u843D",
    legwear: "\u539A\u5E03\u7F20\u817F",
    shoes: "\u5C16\u5934\u7FD8\u9996\u8F6F\u9774",
    accessory: "\u5934\u5DFE\u7F20\u6210\u9AD8\u5305\u72B6, \u8170\u60AC\u94B1\u888B\u4E0E\u7B97\u73E0\u4E32"
  }, ["39-50", "51-65"]),
  c2("wld-me-female-desert", "\u6C99\u6F20\u6E38\u7267\u5973", "female", ["ancient"], ["\u6E38\u7267", "\u6C99\u6F20", "\u4E2D\u4E9A", "\u5F02\u56FD", "\u53E4\u88C5"], "\u6C99\u6F20\u90E8\u65CF\u7684\u5973\u5B50, \u591A\u5C42\u8584\u7EB1\u9632\u6652\u9632\u6C99, \u786C\u5E01\u7247\u9970\u7269\u968F\u52A8\u4F5C\u4F5C\u54CD\u3002", {
    inner: "\u8D34\u8EAB\u77ED\u4E0A\u8863, \u9732\u8170\u4E00\u622A",
    top: "\u591A\u5C42\u8584\u7EB1\u7F69\u8863, \u8896\u53E3\u6781\u9614\u5982\u7FFC",
    bottom: "\u591A\u5C42\u8584\u7EB1\u957F\u88D9, \u8D70\u52A8\u65F6\u5C42\u5C42\u5206\u79BB",
    outerwear: "\u5927\u5E45\u62AB\u5DFE, \u4ECE\u5934\u9876\u7ED5\u81F3\u80A9\u80CC",
    legwear: "\u8D64\u8DB3\u6216\u8584\u7EB1\u8DB3\u8863",
    shoes: "\u8F6F\u5E95\u5E73\u5C65, \u978B\u9762\u7F00\u7EC6\u73E0",
    accessory: "\u989D\u9970\u786C\u5E01\u4E32, \u8155\u4E0E\u8E1D\u5404\u6234\u591A\u53EA\u7EC6\u73AF, \u9762\u8986\u8584\u7EB1"
  }, ["21-28", "29-38"]),
  // ================= 现代海外(欧美 / 移民 / 异域现代) =================
  c2("wld-ovs-male-finance-elite", "\u6D77\u5916\u91D1\u878D\u7CBE\u82F1", "male", ["modern", "career"], ["\u91D1\u878D", "\u7CBE\u82F1", "\u6D77\u5916", "\u6B27\u7F8E", "\u804C\u573A"], "\u56FD\u9645\u91D1\u878D\u673A\u6784\u7684\u9AD8\u9636\u4ECE\u4E1A\u8005, \u5B9A\u5236\u897F\u88C5\u526A\u88C1\u5230\u6BEB\u7C73, \u5168\u8EAB\u65E0\u4E00\u5904\u677E\u57AE\u3002", {
    inner: "\u5B9A\u5236\u886C\u886B, \u9886\u578B\u786C\u633A, \u8896\u53E3\u4F5C\u53CC\u53E0\u7FFB\u8FB9",
    top: "\u53CC\u6392\u6263\u5B9A\u5236\u897F\u88C5\u4E0A\u8863, \u6536\u8170\u660E\u663E, \u80A9\u7EBF\u7B14\u76F4",
    bottom: "\u540C\u6599\u897F\u88E4, \u88E4\u7EBF\u538B\u5F97\u6781\u5229, \u957F\u5EA6\u6070\u53CA\u978B\u9762",
    outerwear: "\u53CA\u819D\u7F8A\u7ED2\u5927\u8863, \u5355\u6392\u6697\u6263",
    legwear: "\u7EC6\u7F57\u7EB9\u957F\u889C, \u4E0E\u88E4\u88C5\u540C\u8C03",
    shoes: "\u725B\u6D25\u7CFB\u5E26\u76AE\u978B, \u978B\u9762\u629B\u81F3\u955C\u9762",
    accessory: "\u8896\u53E3\u4E00\u5BF9\u65B9\u5F62\u8896\u6263, \u8155\u8868\u8868\u76D8\u504F\u8584, \u624B\u63D0\u786C\u58F3\u516C\u6587\u5305"
  }, ["29-38", "39-50"]),
  c2("wld-ovs-male-tech-engineer", "\u7845\u8C37\u5DE5\u7A0B\u5E08", "male", ["modern", "career"], ["\u5DE5\u7A0B\u5E08", "\u79D1\u6280", "\u6D77\u5916", "\u6781\u7B80", "\u804C\u573A"], "\u79D1\u6280\u516C\u53F8\u7684\u5DE5\u7A0B\u5E08, \u6781\u7B80\u5230\u8FD1\u4E4E\u5236\u670D\u5316, \u5168\u5E74\u5C31\u90A3\u51E0\u4EF6\u8F6E\u7740\u7A7F\u3002", {
    inner: "\u7D20\u9762\u5706\u9886T\u6064, \u9762\u6599\u539A\u5B9E\u4E0D\u900F",
    top: "\u62C9\u94FE\u7ACB\u9886\u6293\u7ED2\u5916\u5957, \u80F8\u524D\u7559\u4E00\u679A\u5C0F\u5FBD\u6807\u4F4D",
    bottom: "\u5F39\u529B\u4FEE\u8EAB\u4F11\u95F2\u88E4, \u88E4\u811A\u5FAE\u6536",
    outerwear: "\u8F7B\u8584\u7FBD\u7ED2\u80CC\u5FC3, \u62C9\u94FE\u62C9\u81F3\u80F8\u53E3",
    legwear: "\u8FD0\u52A8\u77ED\u889C",
    shoes: "\u9488\u7EC7\u9762\u8FD0\u52A8\u978B, \u978B\u5E95\u539A\u8F6F",
    accessory: "\u9888\u6302\u5DE5\u724C\u7EF3, \u53CC\u80A9\u5305\u5355\u80A9\u80CC, \u8155\u6234\u8FD0\u52A8\u624B\u73AF"
  }, ["21-28", "29-38"]),
  c2("wld-ovs-female-executive", "\u6D77\u5916\u5973\u9AD8\u7BA1", "female", ["modern", "career"], ["\u9AD8\u7BA1", "\u804C\u573A", "\u6D77\u5916", "\u5F3A\u52BF", "\u6B27\u7F8E"], "\u8DE8\u56FD\u516C\u53F8\u7684\u5973\u6027\u9AD8\u7BA1, \u5ED3\u5F62\u786C\u6717\u3001\u65E0\u591A\u4F59\u88C5\u9970, \u7528\u526A\u88C1\u800C\u4E0D\u662F\u9996\u9970\u7ACB\u5A01\u3002", {
    inner: "\u771F\u4E1D\u8D28\u5730\u886C\u8863, \u9886\u53E3\u4F5C\u7CFB\u5E26\u8774\u8776\u7ED3",
    top: "\u5408\u4F53\u897F\u88C5\u5916\u5957, \u57AB\u80A9\u633A\u62EC, \u4E00\u7C92\u6263\u6536\u8170",
    bottom: "\u53CA\u819D\u94C5\u7B14\u88D9, \u540E\u5F00\u8869",
    outerwear: "\u957F\u6B3E\u5ED3\u5F62\u5927\u8863, \u7CFB\u8170\u5E26\u800C\u975E\u6263\u5408",
    legwear: "\u8584\u6B3E\u8FDE\u88E4\u889C",
    shoes: "\u5C16\u5934\u4E2D\u8DDF\u978B, \u978B\u8DDF\u7EC6\u800C\u7A33",
    accessory: "\u7ED3\u6784\u611F\u624B\u63D0\u5305, \u8033\u9970\u4E3A\u6781\u7B80\u51E0\u4F55\u7247, \u65E0\u9879\u94FE"
  }, ["29-38", "39-50"]),
  c2("wld-ovs-male-student-abroad", "\u6D77\u5916\u7559\u5B66\u751F\u7537", "male", ["modern", "campus"], ["\u7559\u5B66\u751F", "\u5B66\u751F", "\u6D77\u5916", "\u968F\u6027", "\u6821\u56ED"], "\u5728\u56FD\u5916\u8BFB\u4E66\u7684\u7537\u751F, \u6821\u5FBD\u536B\u8863\u914D\u53CC\u80A9\u5305, \u4E00\u5E74\u56DB\u5B63\u90FD\u662F\u8FD9\u5957\u3002", {
    inner: "\u7D20\u9762\u957F\u8896T\u6064",
    top: "\u8FDE\u5E3D\u536B\u8863, \u80F8\u524D\u5370\u6821\u5FBD\u5B57\u6837, \u5E3D\u7EF3\u4E00\u957F\u4E00\u77ED",
    bottom: "\u76F4\u7B52\u725B\u4ED4\u88E4, \u819D\u90E8\u81EA\u7136\u8936\u76B1",
    outerwear: "\u9632\u98CE\u5939\u514B, \u62C9\u94FE\u534A\u5F00",
    legwear: "\u4E2D\u7B52\u68C9\u889C",
    shoes: "\u7ECF\u5178\u6B3E\u677F\u978B, \u978B\u5934\u78E8\u65E7",
    accessory: "\u5927\u5BB9\u91CF\u53CC\u80A9\u5305, \u6302\u7740\u5BBF\u820D\u94A5\u5319\u4E32\u4E0E\u4FDD\u6E29\u676F"
  }, ["16-20", "21-28"]),
  c2("wld-ovs-female-student-abroad", "\u6D77\u5916\u7559\u5B66\u751F\u5973", "female", ["modern", "campus"], ["\u7559\u5B66\u751F", "\u5B66\u751F", "\u6D77\u5916", "\u8F7B\u677E", "\u6821\u56ED"], "\u5728\u56FD\u5916\u8BFB\u4E66\u7684\u5973\u751F, \u5927\u5ED3\u5F62\u4E0A\u8863\u914D\u7D27\u8EAB\u4E0B\u88C5, \u901A\u52E4\u4E0E\u4E0A\u8BFE\u4E00\u5957\u901A\u5403\u3002", {
    inner: "\u8D34\u8EAB\u80CC\u5FC3",
    top: "\u8D85\u5927\u5ED3\u5F62\u5957\u5934\u536B\u8863, \u4E0B\u6446\u62BD\u7EF3",
    bottom: "\u9AD8\u8170\u7D27\u8EAB\u8FD0\u52A8\u957F\u88E4",
    outerwear: "\u77ED\u6B3E\u7FBD\u7ED2\u670D, \u5E3D\u7F18\u4E00\u5708\u7ED2\u6BDB",
    legwear: "\u539A\u68C9\u8239\u889C",
    shoes: "\u539A\u5E95\u8FD0\u52A8\u978B",
    accessory: "\u5E06\u5E03\u6258\u7279\u5305\u585E\u6EE1\u8BB2\u4E49, \u5934\u6234\u9488\u7EC7\u6BDB\u7EBF\u5E3D"
  }, ["16-20", "21-28"]),
  c2("wld-ovs-male-restaurant-owner", "\u6D77\u5916\u9910\u9986\u8001\u677F", "male", ["modern", "career"], ["\u9910\u9986", "\u79FB\u6C11", "\u6D77\u5916", "\u751F\u610F\u4EBA", "\u64CD\u52B3"], "\u5728\u5F02\u56FD\u5F00\u4E2D\u9910\u9986\u7684\u8001\u677F, \u524D\u5385\u540E\u53A8\u6765\u56DE\u8DD1, \u56F4\u88D9\u6BD4\u5916\u5957\u7A7F\u5F97\u591A\u3002", {
    inner: "\u77ED\u8896polo\u886B, \u9886\u53E3\u6D17\u5F97\u677E\u584C",
    top: "\u53CA\u8170\u5DE5\u4F5C\u886C\u886B, \u8896\u5B50\u633D\u81F3\u5C0F\u81C2, \u524D\u895F\u6709\u6CB9\u6E0D",
    bottom: "\u8010\u810F\u5DE5\u88C5\u957F\u88E4, \u677E\u7D27\u8170",
    outerwear: "\u8584\u5939\u514B\u6302\u5728\u529E\u516C\u5BA4\u6905\u80CC, \u51FA\u95E8\u624D\u7A7F",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u9632\u6ED1\u53A8\u623F\u8F6F\u5E95\u978B",
    accessory: "\u8170\u7CFB\u534A\u8EAB\u56F4\u88D9, \u8033\u540E\u5939\u4E00\u652F\u5706\u73E0\u7B14, \u515C\u91CC\u585E\u70B9\u83DC\u5355"
  }, ["39-50", "51-65"]),
  c2("wld-ovs-female-immigrant-mom", "\u6D77\u5916\u534E\u4EBA\u4E3B\u5987", "female", ["modern"], ["\u4E3B\u5987", "\u79FB\u6C11", "\u6D77\u5916", "\u64CD\u6301", "\u6BCD\u4EB2"], "\u968F\u5BB6\u4EBA\u79FB\u5C45\u56FD\u5916\u7684\u4E3B\u5987, \u5BB6\u5E38\u6253\u626E\u91CC\u6DF7\u7740\u65E7\u56FD\u5185\u4E70\u7684\u8863\u670D\u3002", {
    inner: "\u68C9\u8D28\u957F\u8896\u6253\u5E95\u886B",
    top: "\u5F00\u895F\u9488\u7EC7\u886B, \u8863\u957F\u8FC7\u81C0, \u53E3\u888B\u88AB\u65E5\u7528\u54C1\u5760\u5F97\u4E0B\u5782",
    bottom: "\u677E\u7D27\u8170\u4F11\u95F2\u957F\u88E4, \u9762\u6599\u67D4\u8F6F",
    outerwear: "\u8F7B\u4FBF\u77ED\u7FBD\u7ED2\u670D, \u63A5\u9001\u5B69\u5B50\u65F6\u5957\u4E0A",
    legwear: "\u4E2D\u7B52\u68C9\u889C",
    shoes: "\u4E00\u811A\u8E6C\u8F6F\u5E95\u978B",
    accessory: "\u659C\u630E\u5C0F\u5305\u88C5\u94A5\u5319\u4E0E\u8D85\u5E02\u4F1A\u5458\u5361, \u624B\u8155\u6302\u8D2D\u7269\u888B"
  }, ["39-50", "51-65"]),
  c2("wld-ovs-male-migrant-worker", "\u6D77\u5916\u79FB\u6C11\u52B3\u5DE5", "male", ["modern", "rural"], ["\u52B3\u5DE5", "\u79FB\u6C11", "\u6D77\u5916", "\u5E95\u5C42", "\u786C\u625B"], "\u5728\u56FD\u5916\u505A\u4F53\u529B\u6D3B\u7684\u79FB\u6C11, \u5DE5\u88C5\u8010\u78E8, \u53CD\u5149\u6761\u4E0E\u62A4\u5177\u662F\u6BCF\u5929\u7684\u88C5\u5907\u3002", {
    inner: "\u68C9\u8D28\u539AT\u6064, \u9886\u53E3\u62C9\u957F",
    top: "\u5DE5\u88C5\u886C\u886B, \u4E24\u4FA7\u80F8\u888B\u5404\u63D2\u4E00\u6837\u5DE5\u5177, \u80A9\u7F1D\u52A0\u56FA",
    bottom: "\u591A\u53E3\u888B\u5DE5\u88C5\u957F\u88E4, \u819D\u76D6\u5904\u53CC\u5C42\u5E03",
    outerwear: "\u5E26\u53CD\u5149\u6761\u7684\u5DE5\u88C5\u5916\u5957, \u8896\u53E3\u6709\u9B54\u672F\u8D34",
    legwear: "\u539A\u5DE5\u88C5\u889C",
    shoes: "\u94A2\u5934\u52B3\u4FDD\u9774, \u978B\u9762\u522E\u75D5\u5BC6\u5E03",
    accessory: "\u8170\u6302\u5DE5\u5177\u5E26, \u5934\u6234\u5B89\u5168\u5E3D, \u624B\u63D2\u4E00\u526F\u78E8\u7834\u7684\u52B3\u4FDD\u624B\u5957"
  }, ["29-38", "39-50"]),
  c2("wld-ovs-male-detective", "\u6D77\u5916\u8B66\u63A2", "male", ["modern", "career"], ["\u8B66\u63A2", "\u5211\u8B66", "\u6D77\u5916", "\u6B27\u7F8E", "\u5E72\u7EC3"], "\u4FBF\u8863\u8B66\u63A2, \u897F\u88C5\u5916\u5957\u91CC\u6C38\u8FDC\u6302\u7740\u67AA\u5957\u4E0E\u8B66\u5FBD, \u8863\u7740\u4F53\u9762\u4F46\u5E38\u5E74\u4E0D\u71A8\u3002", {
    inner: "\u514D\u70EB\u886C\u886B, \u9886\u53E3\u7B2C\u4E00\u9897\u6263\u5E38\u5F00\u7740",
    top: "\u5355\u6392\u6263\u897F\u88C5\u5916\u5957, \u8863\u6599\u6297\u76B1, \u8098\u90E8\u8D77\u7403",
    bottom: "\u76F4\u7B52\u897F\u88E4, \u88E4\u515C\u88AB\u6742\u7269\u6491\u5F97\u53D8\u5F62",
    outerwear: "\u53CA\u819D\u98CE\u8863, \u8170\u5E26\u968F\u624B\u7CFB\u4E00\u4E2A\u6D3B\u7ED3",
    legwear: "\u6DF1\u8272\u5546\u52A1\u889C",
    shoes: "\u539A\u80F6\u5E95\u7CFB\u5E26\u76AE\u978B, \u4FBF\u4E8E\u8FFD\u4EBA",
    accessory: "\u80A9\u6302\u67AA\u5957, \u8170\u5E26\u522B\u8B66\u5FBD\u5939, \u5185\u888B\u63D2\u8BB0\u4E8B\u672C"
  }, ["39-50", "51-65"]),
  c2("wld-ovs-female-physician", "\u6D77\u5916\u533B\u5E08", "female", ["modern", "career"], ["\u533B\u751F", "\u533B\u5E08", "\u6D77\u5916", "\u4E13\u4E1A", "\u5236\u670D"], "\u533B\u9662\u91CC\u7684\u5973\u533B\u5E08, \u533B\u5E08\u5916\u888D\u7F69\u5728\u901A\u52E4\u88C5\u5916, \u53E3\u888B\u88C5\u6EE1\u7B14\u4E0E\u5361\u7247\u3002", {
    inner: "\u7D20\u9762\u9488\u7EC7\u4E0A\u8863",
    top: "\u533B\u7528\u5206\u4F53\u4E0A\u8863, V \u9886, \u80F8\u524D\u4E00\u679A\u5C0F\u53E3\u888B",
    bottom: "\u540C\u6599\u533B\u7528\u957F\u88E4, \u677E\u7D27\u8170",
    outerwear: "\u53CA\u819D\u533B\u5E08\u5916\u888D, \u524D\u895F\u4E09\u4E2A\u53E3\u888B, \u5DE6\u80F8\u7EE3\u59D3\u540D\u4E0E\u79D1\u5BA4",
    legwear: "\u538B\u529B\u957F\u889C",
    shoes: "\u533B\u7528\u9632\u6ED1\u8F6F\u5E95\u978B",
    accessory: "\u9888\u6302\u542C\u8BCA\u5668, \u80F8\u524D\u522B\u5DE5\u724C, \u53E3\u888B\u63D2\u6570\u652F\u7B14"
  }, ["29-38", "39-50"]),
  c2("wld-ovs-female-fashion-editor", "\u65F6\u5C1A\u7F16\u8F91", "female", ["modern", "career"], ["\u7F16\u8F91", "\u65F6\u5C1A", "\u6D77\u5916", "\u9020\u578B\u611F", "\u804C\u573A"], "\u65F6\u5C1A\u5A92\u4F53\u7684\u7F16\u8F91, \u6574\u8EAB\u662F\u9020\u578B\u4F5C\u54C1, \u5ED3\u5F62\u4E0E\u914D\u9970\u90FD\u5728\u8868\u8FBE\u6001\u5EA6\u3002", {
    inner: "\u7EC6\u540A\u5E26\u5185\u642D",
    top: "\u4E0D\u5BF9\u79F0\u526A\u88C1\u4E0A\u8863, \u4E00\u4FA7\u843D\u80A9\u4E00\u4FA7\u6536\u7D27",
    bottom: "\u9AD8\u8170\u9614\u817F\u957F\u88E4, \u88E4\u811A\u626B\u5730",
    outerwear: "\u8D85\u5927\u5ED3\u5F62\u897F\u88C5\u5916\u5957, \u968F\u610F\u642D\u5728\u80A9\u4E0A\u4E0D\u7A7F\u8896",
    legwear: "\u9690\u5F62\u889C",
    shoes: "\u65B9\u5934\u7C97\u8DDF\u77ED\u9774",
    accessory: "\u814B\u4E0B\u5939\u786C\u58F3\u624B\u5305, \u8033\u9970\u4E0D\u6210\u5BF9, \u9020\u578B\u592A\u9633\u955C\u63A8\u5728\u53D1\u9876(\u975E\u5FC5\u8981\u65F6\u7701\u7565)"
  }, ["21-28", "29-38"]),
  c2("wld-ovs-male-streetwear", "\u8857\u5934\u6F6E\u4EBA", "male", ["modern", "campus"], ["\u6F6E\u6D41", "\u8857\u5934", "\u6D77\u5916", "\u5E74\u8F7B", "\u5F20\u626C"], "\u73A9\u8857\u5934\u6587\u5316\u7684\u5E74\u8F7B\u4EBA, \u5C42\u6B21\u53E0\u7A7F\u3001\u5ED3\u5F62\u5938\u5F20, \u978B\u662F\u5168\u8EAB\u6700\u8D35\u7684\u4E00\u4EF6\u3002", {
    inner: "\u957F\u4E0B\u6446T\u6064, \u9732\u51FA\u5916\u5957\u4E0B\u7F18",
    top: "\u5BBD\u5927\u7403\u8863\u5F0F\u4E0A\u8863, \u80CC\u540E\u5370\u5927\u53F7\u6570\u5B57",
    bottom: "\u843D\u88C6\u5DE5\u88C5\u88E4, \u88E4\u811A\u5806\u53E0\u5728\u978B\u9762",
    outerwear: "\u6CB9\u4EAE\u9762\u6599\u68D2\u7403\u5916\u5957, \u8896\u5B50\u4F5C\u649E\u6599\u62FC\u63A5",
    legwear: "\u9AD8\u7B52\u8FD0\u52A8\u889C, \u889C\u53E3\u9732\u51FA\u4E00\u622A",
    shoes: "\u539A\u5E95\u9AD8\u5E2E\u7403\u978B, \u978B\u5E26\u6545\u610F\u4E0D\u7CFB",
    accessory: "\u68D2\u7403\u5E3D\u53CD\u6234, \u9888\u6302\u7C97\u94FE, \u659C\u630E\u5C0F\u80F8\u5305"
  }, ["16-20", "21-28"]),
  c2("wld-ovs-female-resort", "\u6D77\u5916\u5EA6\u5047\u8D35\u5987", "female", ["modern"], ["\u8D35\u5987", "\u5EA6\u5047", "\u6D77\u5916", "\u5962\u534E", "\u677E\u5F1B"], "\u5728\u6D77\u6EE8\u5EA6\u5047\u7684\u5BCC\u592A\u592A, \u4E00\u8EAB\u8F7B\u8584\u98D8\u9038, \u914D\u9970\u6BD4\u8863\u670D\u66F4\u8D35\u3002", {
    inner: "\u8FDE\u4F53\u5F0F\u6CF3\u88C5\u4F5C\u5185\u5C42",
    top: "\u5BBD\u677E\u7F69\u886B, \u9762\u6599\u534A\u900F, \u9886\u53E3\u6DF1\u5F00",
    bottom: "\u53CA\u8E1D\u9614\u817F\u6C99\u6EE9\u957F\u88E4, \u8D70\u52A8\u65F6\u8D34\u817F\u98D8\u8D77",
    outerwear: "\u4E9A\u9EBB\u957F\u5F00\u886B, \u655E\u5F00\u4E0D\u7CFB",
    legwear: "\u65E0",
    shoes: "\u5E73\u5E95\u7F16\u7EC7\u51C9\u978B, \u978B\u9762\u7F00\u8D1D\u9970",
    accessory: "\u5BBD\u6A90\u8349\u5E3D, \u8155\u4E0A\u591A\u5708\u7EC6\u624B\u956F, \u8D85\u5927\u6B3E\u592A\u9633\u955C(\u975E\u5FC5\u8981\u65F6\u7701\u7565)"
  }, ["39-50", "51-65"]),
  c2("wld-ovs-male-ranch-cowboy", "\u7267\u573A\u725B\u4ED4", "male", ["modern", "rural"], ["\u725B\u4ED4", "\u7267\u573A", "\u6D77\u5916", "\u7C97\u72B7", "\u4E61\u6751"], "\u7267\u573A\u5E72\u6D3B\u7684\u725B\u4ED4, \u5168\u5957\u90FD\u4E3A\u9A91\u9A6C\u548C\u98CE\u5439\u65E5\u6652\u8BBE\u8BA1, \u76AE\u4EF6\u78E8\u51FA\u5305\u6D46\u3002", {
    inner: "\u73E0\u6263\u5DE5\u88C5\u886C\u886B, \u524D\u895F\u4E24\u4E2A\u5C16\u89D2\u80F8\u888B",
    top: "\u76AE\u8D28\u9A6C\u7532, \u524D\u895F\u65E0\u6263\u655E\u5F00, \u76AE\u9762\u78E8\u51FA\u5149\u6CFD",
    bottom: "\u76F4\u7B52\u725B\u4ED4\u88E4, \u5927\u817F\u5185\u4FA7\u78E8\u8584",
    outerwear: "\u539A\u5E06\u5E03\u5916\u5957, \u9886\u53E3\u4E00\u5708\u8D77\u7ED2\u886C\u91CC",
    legwear: "\u539A\u68C9\u7B52\u889C",
    shoes: "\u5C16\u5934\u9AD8\u7B52\u9A6C\u9774, \u540E\u8DDF\u5E26\u9A6C\u523A",
    accessory: "\u5BBD\u6A90\u6BE1\u5E3D, \u5927\u6263\u76AE\u8170\u5E26, \u9888\u7CFB\u4E09\u89D2\u5DFE"
  }, ["29-38", "39-50"]),
  c2("wld-ovs-male-old-gentleman", "\u6B27\u9646\u8001\u7EC5\u58EB", "male", ["modern", "elder"], ["\u7EC5\u58EB", "\u8001\u5E74", "\u6D77\u5916", "\u8BB2\u7A76", "\u6B27\u9646"], "\u4E0A\u4E86\u5E74\u7EAA\u4ECD\u8BB2\u7A76\u7684\u8001\u5148\u751F, \u6BCF\u5929\u51FA\u95E8\u5FC5\u6234\u5E3D, \u8863\u670D\u65E7\u4F46\u71A8\u5F97\u7B14\u633A\u3002", {
    inner: "\u7EC6\u683C\u7EB9\u886C\u886B, \u9886\u53E3\u6263\u9F50",
    top: "\u9488\u7EC7\u9A6C\u7532, V \u9886, \u7F57\u7EB9\u4E0B\u6446\u7565\u677E",
    bottom: "\u76F4\u7B52\u7F8A\u6BDB\u957F\u88E4, \u88E4\u7EBF\u4FDD\u6301\u5F97\u4F4F",
    outerwear: "\u659C\u7EB9\u8F6F\u5462\u5916\u5957, \u8098\u90E8\u7F1D\u692D\u5706\u5F62\u8865\u7247",
    legwear: "\u7F57\u7EB9\u957F\u889C",
    shoes: "\u7CFB\u5E26\u76AE\u978B, \u978B\u9762\u5E38\u5E74\u6253\u8721",
    accessory: "\u7A84\u6A90\u793C\u5E3D, \u624B\u6301\u6728\u67C4\u96E8\u4F1E\u5F53\u62D0\u6756, \u80F8\u888B\u63D2\u65B9\u5DFE"
  }, ["66-80", "80+"]),
  c2("wld-ovs-female-nordic-minimal", "\u5317\u6B27\u6781\u7B80", "female", ["modern"], ["\u6781\u7B80", "\u5317\u6B27", "\u6D77\u5916", "\u51B7\u6DE1", "\u8BBE\u8BA1\u611F"], "\u5317\u6B27\u751F\u6D3B\u65B9\u5F0F\u7684\u5973\u6027, \u65E0\u5370\u82B1\u65E0 logo, \u9760\u9762\u6599\u4E0E\u5ED3\u5F62\u8BF4\u8BDD\u3002", {
    inner: "\u9AD8\u9886\u8D34\u8EAB\u6253\u5E95\u886B",
    top: "\u843D\u80A9\u9488\u7EC7\u886B, \u9762\u6599\u539A\u91CD\u5782\u5760, \u65E0\u4EFB\u4F55\u56FE\u6848",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u88E4\u957F\u6070\u53CA\u8E1D\u9AA8",
    outerwear: "\u8327\u578B\u957F\u5927\u8863, \u65E0\u6263, \u7528\u540C\u6599\u8170\u5E26\u968F\u610F\u7CFB\u4F4F",
    legwear: "\u539A\u7F8A\u6BDB\u889C",
    shoes: "\u539A\u5E95\u5207\u5C14\u897F\u9774",
    accessory: "\u5927\u65B9\u5DFE\u7ED5\u9888\u4E24\u5708, \u5E06\u5E03\u624B\u63D0\u888B, \u65E0\u4EFB\u4F55\u9996\u9970"
  }, ["21-28", "29-38"]),
  c2("wld-ovs-female-market-vendor", "\u5357\u6D0B\u5E02\u96C6\u644A\u8D29", "female", ["modern", "rural"], ["\u644A\u8D29", "\u5E02\u96C6", "\u5357\u6D0B", "\u6D77\u5916", "\u5E02\u4E95"], "\u70ED\u5E26\u5E02\u96C6\u5356\u8D27\u7684\u5987\u4EBA, \u8863\u6599\u900F\u6C14\u3001\u56FE\u6848\u7E41\u5BC6, \u5934\u5DFE\u4E0E\u56F4\u88D9\u7EC8\u65E5\u4E0D\u6458\u3002", {
    inner: "\u68C9\u8D28\u77ED\u8896\u5185\u886C",
    top: "\u5BBD\u677E\u7F69\u886B, \u901A\u4F53\u5370\u6EE1\u5BC6\u96C6\u690D\u7269\u7EB9, \u4E0B\u6446\u5BBD\u5927",
    bottom: "\u7B52\u88D9, \u4E00\u7247\u5E03\u5728\u8170\u95F4\u6253\u7ED3\u56FA\u5B9A",
    outerwear: "\u65E0\u5916\u5957\u5C42, \u96E8\u5929\u62AB\u5851\u6599\u8584\u96E8\u8863",
    legwear: "\u8D64\u8DB3\u6216\u8584\u889C",
    shoes: "\u4EBA\u5B57\u62D6, \u978B\u5E95\u78E8\u5E73",
    accessory: "\u5934\u5DFE\u5305\u4F4F\u53D1, \u8170\u7CFB\u6536\u94B1\u5E03\u888B, \u624B\u6234\u7EC6\u956F\u6570\u53EA"
  }, ["39-50", "51-65"]),
  c2("wld-ovs-male-gulf-businessman", "\u6D77\u6E7E\u5546\u4EBA", "male", ["modern", "career"], ["\u5546\u4EBA", "\u6D77\u6E7E", "\u4E2D\u4E1C", "\u6D77\u5916", "\u6C14\u6D3E"], "\u6D77\u6E7E\u5730\u533A\u7684\u751F\u610F\u4EBA, \u901A\u4F53\u4E00\u4EF6\u957F\u888D\u52A0\u5934\u5DFE, \u7B80\u6D01\u4F46\u7528\u6599\u9876\u7EA7\u3002", {
    inner: "\u8D34\u8EAB\u957F\u5185\u886C",
    top: "\u53CA\u8E1D\u76F4\u7B52\u957F\u888D, \u7ACB\u9886\u65E0\u7FFB\u6298, \u524D\u895F\u81EA\u9888\u81F3\u80F8\u6392\u7EC6\u6263",
    bottom: "\u957F\u888D\u4E0B\u6446\u53CA\u8DB3\u9762, \u5185\u886C\u76F4\u7B52\u957F\u88E4",
    outerwear: "\u534A\u900F\u8584\u7EB1\u5916\u888D, \u8FB9\u7F18\u7EC7\u7EC6\u91D1\u5C5E\u7EBF\u7EB9, \u655E\u5F00\u62AB\u7740",
    legwear: "\u8584\u68C9\u889C",
    shoes: "\u65E0\u5E26\u5E73\u5E95\u76AE\u51C9\u978B",
    accessory: "\u65B9\u5DFE\u6298\u6210\u5934\u5DFE\u5E76\u7528\u53CC\u73AF\u5934\u7B8D\u56FA\u5B9A, \u8155\u6234\u539A\u91CD\u8155\u8868, \u624B\u6301\u5FF5\u73E0\u4E32"
  }, ["39-50", "51-65"]),
  // ================= 民国(republican) =================
  c2("wld-rep-female-student", "\u6C11\u56FD\u5973\u5B66\u751F", "female", ["republican"], ["\u5973\u5B66\u751F", "\u5B66\u751F", "\u6C11\u56FD", "\u6E05\u7EAF", "\u65B0\u5F0F"], "\u65B0\u5F0F\u5B66\u5802\u7684\u5973\u5B66\u751F, \u4E0A\u8863\u4E0B\u88D9\u7684\u5B66\u751F\u88C5, \u9F50\u8033\u77ED\u53D1\u662F\u90A3\u4EE3\u4EBA\u7684\u6807\u5FD7\u3002", {
    inner: "\u7D20\u9762\u68C9\u5185\u886C",
    top: "\u7A84\u8896\u4E0A\u8863, \u7ACB\u9886\u6263\u81F3\u9888, \u8863\u957F\u53CA\u81C0, \u4E0B\u6446\u5448\u5F27\u5F62",
    bottom: "\u53CA\u819D\u4E0B\u6446\u7684\u767E\u8936\u88D9, \u8936\u88E5\u538B\u5B9E",
    outerwear: "\u77ED\u6B3E\u6597\u7BF7\u5F0F\u5916\u62AB, \u7CFB\u5E26\u5728\u9888\u524D",
    legwear: "\u4E2D\u7B52\u68C9\u7EBF\u957F\u889C",
    shoes: "\u5706\u5934\u7CFB\u5E26\u76AE\u978B",
    accessory: "\u9F50\u8033\u77ED\u53D1\u522B\u4E00\u53EA\u53D1\u5939, \u62B1\u5E03\u9762\u4E66\u5305"
  }, ["16-20"]),
  c2("wld-rep-female-teacher", "\u6C11\u56FD\u5973\u6559\u5458", "female", ["republican"], ["\u6559\u5458", "\u6559\u5E08", "\u6C11\u56FD", "\u7AEF\u5E84", "\u77E5\u8BC6"], "\u5973\u5B50\u5B66\u5802\u7684\u6559\u5458, \u65D7\u888D\u5916\u7F69\u5F00\u886B, \u5206\u5BF8\u611F\u6781\u5F3A\u3002", {
    inner: "\u7D20\u9762\u5185\u886C",
    top: "\u5408\u8EAB\u65D7\u888D, \u7ACB\u9886, \u4FA7\u895F\u76D8\u6263, \u5F00\u8869\u4EC5\u81F3\u5C0F\u817F",
    bottom: "\u65D7\u888D\u4E0B\u6446\u53CA\u5C0F\u817F\u4E2D\u6BB5",
    outerwear: "\u9488\u7EC7\u5F00\u886B, \u8896\u53E3\u7565\u89C1\u78E8\u635F",
    legwear: "\u957F\u7B52\u68C9\u889C",
    shoes: "\u4F4E\u8DDF\u5E03\u9762\u642D\u6263\u978B",
    accessory: "\u53D1\u9AFB\u4F4E\u633D\u7528\u53D1\u7F51\u7F69\u4F4F, \u631F\u4E00\u645E\u8BB2\u4E49\u4E0E\u6559\u97AD"
  }, ["29-38", "39-50"]),
  c2("wld-rep-female-socialite", "\u6C11\u56FD\u540D\u95E8\u5C0F\u59D0", "female", ["republican"], ["\u5C0F\u59D0", "\u540D\u95E8", "\u6C11\u56FD", "\u6469\u767B", "\u6D0B\u6D3E"], "\u6D0B\u6D3E\u5BB6\u5EAD\u7684\u5927\u5C0F\u59D0, \u65D7\u888D\u526A\u88C1\u8D34\u8EAB\u3001\u6599\u5B50\u8003\u7A76, \u914D\u897F\u5F0F\u624B\u888B\u4E0E\u5377\u53D1\u3002", {
    inner: "\u8D34\u8EAB\u886C\u88D9",
    top: "\u6536\u8EAB\u65D7\u888D, \u9AD8\u7ACB\u9886, \u9886\u7F18\u4E0E\u895F\u7F18\u53E6\u63A5\u4E00\u9053\u9576\u8FB9, \u6EE1\u8EAB\u6697\u63D0\u82B1",
    bottom: "\u65D7\u888D\u4E0B\u6446\u53CA\u8E1D, \u4E24\u4FA7\u5F00\u8869\u81F3\u819D\u4E0A",
    outerwear: "\u77ED\u6B3E\u6BDB\u76AE\u5C0F\u62AB\u80A9, \u642D\u5728\u80A9\u5934",
    legwear: "\u8584\u4E1D\u957F\u889C",
    shoes: "\u7EC6\u8DDF\u7CFB\u5E26\u9AD8\u8DDF\u978B",
    accessory: "\u624B\u62FF\u786C\u58F3\u5C0F\u624B\u888B, \u5377\u53D1\u522B\u73CD\u73E0\u53D1\u5361, \u8033\u5760\u5782\u4E24\u9897"
  }, ["21-28", "29-38"]),
  c2("wld-rep-female-dancer", "\u821E\u5385\u6B4C\u5973", "female", ["republican"], ["\u6B4C\u5973", "\u821E\u5973", "\u6C11\u56FD", "\u98CE\u60C5", "\u591C\u573A"], "\u821E\u5385\u91CC\u8BA8\u751F\u6D3B\u7684\u6B4C\u5973, \u4EAE\u7247\u4E0E\u5F00\u8869\u90FD\u4E3A\u821E\u53F0\u706F\u5149\u8BBE\u8BA1\u3002", {
    inner: "\u8D34\u8EAB\u886C\u88D9, \u88D9\u6446\u6781\u77ED",
    top: "\u65E0\u8896\u6536\u8EAB\u65D7\u888D, \u901A\u4F53\u7F00\u7EC6\u5BC6\u4EAE\u7247, \u9886\u53E3\u4F4E\u5F00",
    bottom: "\u65D7\u888D\u4E0B\u6446\u53CA\u8E1D, \u4E00\u4FA7\u5F00\u8869\u6781\u9AD8",
    outerwear: "\u7FBD\u6BDB\u62AB\u80A9\u7ED5\u81C2\u5782\u843D",
    legwear: "\u7F51\u773C\u957F\u889C",
    shoes: "\u7EC6\u9AD8\u8DDF\u7ED1\u5E26\u978B",
    accessory: "\u6CE2\u6D6A\u5377\u53D1\u522B\u7FBD\u9970\u53D1\u5939, \u957F\u67C4\u70DF\u5634, \u8155\u6234\u5BBD\u956F"
  }, ["21-28", "29-38"]),
  c2("wld-rep-female-journalist", "\u6C11\u56FD\u5973\u8BB0\u8005", "female", ["republican"], ["\u8BB0\u8005", "\u62A5\u793E", "\u6C11\u56FD", "\u5E72\u7EC3", "\u65B0\u5973\u6027"], "\u8DD1\u65B0\u95FB\u7684\u5973\u8BB0\u8005, \u65D7\u888D\u6362\u6210\u4FBF\u4E8E\u884C\u52A8\u7684\u897F\u5F0F\u5957\u88C5, \u76F8\u673A\u4E0E\u672C\u5B50\u4E0D\u79BB\u624B\u3002", {
    inner: "\u7ACB\u9886\u886C\u8863",
    top: "\u5408\u4F53\u897F\u5F0F\u77ED\u5916\u5957, \u57AB\u80A9\u7565\u633A, \u4E00\u6392\u5C0F\u6263",
    bottom: "\u53CA\u5C0F\u817F\u7684\u76F4\u7B52\u534A\u88D9",
    outerwear: "\u53CA\u819D\u98CE\u8863, \u8170\u5E26\u624E\u7D27",
    legwear: "\u957F\u7B52\u889C",
    shoes: "\u7C97\u8DDF\u7CFB\u5E26\u76AE\u978B, \u4FBF\u4E8E\u5954\u8D70",
    accessory: "\u659C\u630E\u76AE\u8D28\u76F8\u673A\u5305, \u624B\u6301\u8BB0\u4E8B\u672C\u4E0E\u94A2\u7B14, \u5934\u6234\u8D1D\u96F7\u5E3D"
  }, ["21-28", "29-38"]),
  c2("wld-rep-female-servant", "\u516C\u9986\u5973\u4F63", "female", ["republican"], ["\u5973\u4F63", "\u8001\u5988\u5B50", "\u6C11\u56FD", "\u52E4\u8C28", "\u4EC6\u5F79"], "\u5927\u6237\u4EBA\u5BB6\u7684\u5973\u4F63, \u5927\u895F\u8902\u914D\u957F\u88E4, \u56F4\u88D9\u4ECE\u65E9\u7A7F\u5230\u665A\u3002", {
    inner: "\u7D20\u9762\u5185\u886C",
    top: "\u5927\u895F\u77ED\u8902, \u4FA7\u895F\u5E03\u6263, \u8896\u5B50\u633D\u8D77\u534A\u622A",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u88E4\u811A\u7565\u5BBD",
    outerwear: "\u51AC\u65E5\u52A0\u4E00\u4EF6\u5BF9\u895F\u68C9\u8902",
    legwear: "\u68C9\u5E03\u889C",
    shoes: "\u5E73\u5E95\u5E03\u978B",
    accessory: "\u53D1\u9AFB\u7528\u53D1\u7F51\u7B8D\u4F4F, \u8170\u7CFB\u534A\u8EAB\u56F4\u88D9, \u80A9\u642D\u62B9\u5E03"
  }, ["39-50", "51-65"]),
  c2("wld-rep-male-student", "\u6C11\u56FD\u7537\u5B66\u751F", "male", ["republican", "campus"], ["\u7537\u5B66\u751F", "\u5B66\u751F", "\u6C11\u56FD", "\u4E66\u5377", "\u65B0\u5F0F"], "\u65B0\u5F0F\u5B66\u5802\u7684\u7537\u5B66\u751F, \u5B66\u751F\u88C5\u7ACB\u9886\u6263\u9F50, \u5706\u6846\u773C\u955C\u4E0E\u5E03\u4E66\u5305\u3002", {
    inner: "\u7D20\u9762\u886C\u8863, \u9886\u53E3\u6263\u7D27",
    top: "\u7ACB\u9886\u5B66\u751F\u88C5\u4E0A\u8863, \u524D\u895F\u4E94\u7C92\u6263, \u80F8\u524D\u4E00\u4E2A\u660E\u888B",
    bottom: "\u540C\u6599\u76F4\u7B52\u957F\u88E4, \u88E4\u811A\u7565\u7A84",
    outerwear: "\u8584\u5462\u77ED\u5916\u5957, \u51AC\u65E5\u52A0\u7A7F",
    legwear: "\u68C9\u7EBF\u957F\u889C",
    shoes: "\u7CFB\u5E26\u5E03\u9762\u80F6\u5E95\u978B",
    accessory: "\u659C\u630E\u5E03\u4E66\u5305, \u77ED\u53D1\u68B3\u5F97\u6574\u9F50"
  }, ["16-20"]),
  c2("wld-rep-male-officer", "\u6C11\u56FD\u519B\u5B98", "male", ["republican"], ["\u519B\u5B98", "\u519B\u4EBA", "\u6C11\u56FD", "\u5A01\u4E25", "\u5236\u670D"], "\u6B63\u89C4\u519B\u7684\u519B\u5B98, \u5236\u670D\u7B14\u633A\u3001\u80A9\u7AE0\u4E0E\u6B66\u88C5\u5E26\u9F50\u5168, \u7AD9\u59FF\u6C38\u8FDC\u7AEF\u7740\u3002", {
    inner: "\u7ACB\u9886\u886C\u8863",
    top: "\u7ACB\u9886\u519B\u4FBF\u670D\u4E0A\u8863, \u524D\u895F\u6392\u4E00\u5217\u94DC\u6263, \u53CC\u80F8\u888B\u5E26\u888B\u76D6",
    bottom: "\u9A6C\u88E4, \u5927\u817F\u5904\u5BBD\u677E\u819D\u4E0B\u6536\u7D27",
    outerwear: "\u539A\u5462\u519B\u5927\u8863, \u53CC\u6392\u6263, \u540E\u8170\u7CFB\u5E26",
    legwear: "\u76AE\u8D28\u7ED1\u817F, \u7F20\u81F3\u819D\u4E0B",
    shoes: "\u9AD8\u7B52\u9A6C\u9774, \u9774\u9762\u6253\u6CB9",
    accessory: "\u5927\u6A90\u5E3D, \u659C\u8DE8\u6B66\u88C5\u5E26, \u80A9\u7F00\u519B\u8854\u7AE0"
  }, ["29-38", "39-50"]),
  c2("wld-rep-male-gangster", "\u5E2E\u6D3E\u5927\u4F6C", "male", ["republican"], ["\u5E2E\u6D3E", "\u5927\u4F6C", "\u6C11\u56FD", "\u72E0\u623E", "\u6C5F\u6E56"], "\u7801\u5934\u5E2E\u6D3E\u7684\u5934\u9762\u4EBA\u7269, \u957F\u886B\u4E0E\u897F\u5F0F\u9A6C\u7532\u6DF7\u7A7F, \u624B\u4E0A\u6C38\u8FDC\u76D8\u7740\u4E00\u4EF6\u4E1C\u897F\u3002", {
    inner: "\u7ACB\u9886\u886C\u8863, \u9886\u53E3\u5F00\u4E00\u9897\u6263",
    top: "\u897F\u5F0F\u9A6C\u7532\u7F69\u5728\u957F\u886B\u5916, \u524D\u895F\u6392\u5C0F\u6263",
    bottom: "\u957F\u886B\u4E0B\u6446\u53CA\u5C0F\u817F, \u8D70\u52A8\u65F6\u7529\u8D77",
    outerwear: "\u6BDB\u9886\u539A\u5462\u5916\u5957, \u62AB\u5728\u80A9\u4E0A\u4E0D\u7A7F\u8896",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u5C16\u5934\u7CFB\u5E26\u76AE\u978B",
    accessory: "\u793C\u5E3D\u538B\u4F4E, \u624B\u76D8\u6838\u6843\u6216\u8F6C\u6273\u6307, \u8155\u6234\u7C97\u94FE\u8868"
  }, ["39-50", "51-65"]),
  c2("wld-rep-male-editor", "\u62A5\u9986\u4E3B\u7B14", "male", ["republican"], ["\u4E3B\u7B14", "\u62A5\u9986", "\u6C11\u56FD", "\u4E66\u751F", "\u6587\u4EBA"], "\u62A5\u9986\u91CC\u5199\u7A3F\u7684\u4E3B\u7B14, \u957F\u886B\u5916\u7F69\u897F\u5F0F\u9A6C\u7532, \u8896\u53E3\u5E38\u5E74\u6CBE\u58A8\u3002", {
    inner: "\u7ACB\u9886\u5185\u886C",
    top: "\u76F4\u8EAB\u957F\u886B, \u4FA7\u895F\u5E03\u6263, \u8896\u53E3\u6709\u58A8\u8FF9",
    bottom: "\u957F\u886B\u4E0B\u6446\u53CA\u8E1D",
    outerwear: "\u9488\u7EC7\u5F00\u886B\u5957\u5728\u957F\u886B\u5916, \u624B\u8098\u5904\u78E8\u8584",
    legwear: "\u68C9\u889C",
    shoes: "\u5E03\u9762\u5E73\u5E95\u978B",
    accessory: "\u80F8\u888B\u63D2\u94A2\u7B14\u4E24\u652F, \u814B\u4E0B\u5939\u7A3F\u7EB8\u5377"
  }, ["29-38", "39-50"]),
  c2("wld-rep-male-comprador", "\u6D0B\u884C\u4E70\u529E", "male", ["republican"], ["\u4E70\u529E", "\u6D0B\u884C", "\u6C11\u56FD", "\u6D0B\u6D3E", "\u7CBE\u660E"], "\u5728\u6D0B\u884C\u505A\u4E8B\u7684\u4E70\u529E, \u4E00\u8EAB\u5168\u5957\u897F\u88C5, \u6BD4\u6D0B\u4EBA\u66F4\u8BB2\u7A76\u6D3E\u5934\u3002", {
    inner: "\u786C\u9886\u886C\u886B, \u7CFB\u6761\u7EB9\u9886\u5E26",
    top: "\u4E09\u4EF6\u5957\u897F\u88C5\u7684\u9A6C\u7532, \u6302\u6000\u8868\u94FE",
    bottom: "\u897F\u88E4, \u88E4\u811A\u6709\u7FFB\u8FB9",
    outerwear: "\u5355\u6392\u6263\u897F\u88C5\u5916\u5957, \u80F8\u888B\u63D2\u65B9\u5DFE",
    legwear: "\u957F\u7B52\u889C, \u7528\u889C\u5939\u56FA\u5B9A",
    shoes: "\u4E24\u622A\u62FC\u8272\u7CFB\u5E26\u76AE\u978B",
    accessory: "\u793C\u5E3D\u4E0E\u624B\u6756\u6210\u5957, \u624B\u6307\u5939\u96EA\u8304"
  }, ["39-50", "51-65"]),
  c2("wld-rep-male-rickshaw", "\u9EC4\u5305\u8F66\u592B", "male", ["republican"], ["\u8F66\u592B", "\u82E6\u529B", "\u6C11\u56FD", "\u5E95\u5C42", "\u5E02\u4E95"], "\u62C9\u8F66\u8C0B\u751F\u7684\u8F66\u592B, \u77ED\u6253\u4FBF\u4E8E\u53D1\u529B, \u6C57\u5DFE\u7EC8\u65E5\u642D\u5728\u9888\u4E0A\u3002", {
    inner: "\u65E0\u5185\u886C, \u76F4\u63A5\u4E00\u4EF6\u6C57\u886B",
    top: "\u5BF9\u895F\u77ED\u8902, \u524D\u895F\u655E\u5F00, \u5E03\u6263\u6389\u4E86\u4E24\u9897",
    bottom: "\u53CA\u819D\u77ED\u88E4\u6216\u633D\u5230\u819D\u4E0A\u7684\u957F\u88E4",
    outerwear: "\u51AC\u65E5\u4E00\u4EF6\u8584\u68C9\u574E\u80A9",
    legwear: "\u5E03\u6761\u7F20\u817F",
    shoes: "\u8349\u7F16\u978B\u6216\u8D64\u811A",
    accessory: "\u9888\u642D\u6C57\u5DFE, \u5934\u6234\u7834\u65E7\u6BE1\u5E3D, \u8170\u624E\u5E03\u5E26"
  }, ["29-38", "39-50"]),
  c2("wld-rep-male-old-scholar", "\u524D\u6E05\u8001\u5B66\u7A76", "male", ["republican"], ["\u5B66\u7A76", "\u9057\u8001", "\u6C11\u56FD", "\u5B88\u65E7", "\u957F\u8F88"], "\u8FD8\u7559\u7740\u65E7\u4E60\u60EF\u7684\u8001\u5148\u751F, \u4E00\u8EAB\u957F\u888D\u9A6C\u8902, \u4E0E\u8857\u4E0A\u7684\u897F\u88C5\u683C\u683C\u4E0D\u5165\u3002", {
    inner: "\u4EA4\u9886\u4E2D\u8863",
    top: "\u76F4\u8EAB\u957F\u888D, \u4FA7\u895F\u4E00\u5217\u5E03\u6263, \u4E0B\u6446\u53CA\u8E1D",
    bottom: "\u957F\u888D\u5185\u7A7F\u76F4\u7B52\u5E03\u88E4",
    outerwear: "\u5BF9\u895F\u9A6C\u8902\u7F69\u5728\u957F\u888D\u5916, \u524D\u895F\u4E94\u7C92\u76D8\u6263",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u539A\u5E95\u5E03\u9762\u978B",
    accessory: "\u74DC\u76AE\u5C0F\u5E3D, \u624B\u6301\u957F\u6746\u70DF\u888B, \u8155\u6302\u5FF5\u73E0"
  }, ["51-65", "66-80"]),
  // ================= 边缘年龄档补位(此前候选池为 0 或个位数的组合) =================
  c2("wld-edge-male-intern", "\u804C\u573A\u7537\u5B9E\u4E60\u751F", "male", ["career", "modern"], ["\u5B9E\u4E60\u751F", "\u65B0\u4EBA", "\u804C\u573A", "\u9752\u6DA9", "\u62D8\u8C28"], "\u521A\u8FDB\u516C\u53F8\u7684\u7537\u5B9E\u4E60\u751F, \u897F\u88C5\u662F\u4E70\u6765\u6491\u573A\u9762\u7684, \u5C3A\u7801\u7565\u5927\u3001\u4E0A\u8EAB\u53D1\u7A7A\u3002", {
    inner: "\u514D\u70EB\u886C\u886B, \u9886\u578B\u504F\u8F6F, \u9886\u53E3\u7565\u7A7A",
    top: "\u5355\u6392\u6263\u897F\u88C5\u5916\u5957, \u80A9\u7EBF\u7565\u5BBD\u4E8E\u8EAB\u5F62, \u8896\u957F\u8FC7\u8155",
    bottom: "\u897F\u88E4, \u88E4\u811A\u5728\u978B\u9762\u5806\u51FA\u4E00\u9053\u8936",
    outerwear: "\u8584\u6B3E\u98CE\u8863, \u660E\u663E\u662F\u5BB6\u91CC\u7ED9\u5907\u7684",
    legwear: "\u5546\u52A1\u77ED\u889C, \u5750\u4E0B\u65F6\u9732\u51FA\u4E00\u622A\u811A\u8E1D",
    shoes: "\u7CFB\u5E26\u76AE\u978B, \u978B\u9762\u8FD8\u5F88\u65B0\u6CA1\u6709\u6298\u75D5",
    accessory: "\u5DE5\u724C\u6302\u7EF3\u8FD8\u662F\u65B0\u7684, \u53CC\u80A9\u5305\u80CC\u5728\u897F\u88C5\u5916, \u624B\u91CC\u6525\u7B14\u8BB0\u672C"
  }, ["16-20", "21-28"]),
  c2("wld-edge-female-intern", "\u804C\u573A\u5973\u5B9E\u4E60\u751F", "female", ["career", "modern"], ["\u5B9E\u4E60\u751F", "\u65B0\u4EBA", "\u804C\u573A", "\u9752\u6DA9", "\u52AA\u529B"], "\u7B2C\u4E00\u4EFD\u5B9E\u4E60\u7684\u5973\u751F, \u901A\u52E4\u88C5\u504F\u5B66\u751F\u6C14, \u7528\u5E73\u5E95\u978B\u548C\u6258\u7279\u5305\u4FDD\u4F4F\u4F53\u9762\u3002", {
    inner: "\u7D20\u9762\u9488\u7EC7\u6253\u5E95",
    top: "\u5408\u4F53\u5C0F\u897F\u88C5\u5916\u5957, \u8896\u957F\u7A0D\u957F",
    bottom: "\u53CA\u819D\u76F4\u7B52\u534A\u88D9",
    outerwear: "\u8584\u6B3E\u77ED\u5916\u5957",
    legwear: "\u8089\u8272\u8584\u889C",
    shoes: "\u5706\u5934\u5E73\u5E95\u978B, \u978B\u8DDF\u8FD8\u6CA1\u78E8\u635F",
    accessory: "\u5927\u53F7\u6258\u7279\u5305, \u91CC\u9762\u585E\u7740\u996D\u76D2\u4E0E\u6587\u4EF6\u5939, \u5DE5\u724C\u62FF\u5728\u624B\u91CC"
  }, ["16-20", "21-28"]),
  c2("wld-edge-male-teacher", "\u4E2D\u5B66\u7537\u6559\u5E08", "male", ["campus", "career"], ["\u6559\u5E08", "\u8001\u5E08", "\u6821\u56ED", "\u4E2D\u5E74", "\u514B\u5236"], "\u5E26\u6BD5\u4E1A\u73ED\u7684\u7537\u8001\u5E08, \u886C\u886B\u52A0\u6BDB\u80CC\u5FC3\u662F\u5E38\u5E74\u5236\u670D, \u7C89\u7B14\u672B\u64E6\u4E0D\u5E72\u51C0\u3002", {
    inner: "\u7D20\u9762\u957F\u8896\u886C\u886B, \u9886\u53E3\u6263\u4E24\u9897",
    top: "V \u9886\u6BDB\u80CC\u5FC3, \u7F57\u7EB9\u4E0B\u6446\u7565\u677E",
    bottom: "\u76F4\u7B52\u897F\u88E4, \u5E38\u5E74\u53EA\u6709\u4E24\u4E09\u6761\u8F6E\u6362",
    outerwear: "\u8584\u5939\u514B, \u6302\u5728\u529E\u516C\u5BA4\u6905\u80CC\u4E0A",
    legwear: "\u5546\u52A1\u4E2D\u7B52\u889C",
    shoes: "\u8F6F\u5E95\u7CFB\u5E26\u76AE\u978B, \u8D70\u5ECA\u8D70\u5F97\u591A\u978B\u8DDF\u5916\u504F",
    accessory: "\u80F8\u888B\u63D2\u6279\u6539\u7B14\u4E0E\u6559\u97AD, \u8896\u53E3\u6CBE\u7C89\u7B14\u7070, \u624B\u5939\u5907\u8BFE\u672C"
  }, ["39-50", "51-65"]),
  c2("wld-edge-female-teacher", "\u4E2D\u5B66\u5973\u6559\u5E08", "female", ["campus", "career"], ["\u6559\u5E08", "\u8001\u5E08", "\u6821\u56ED", "\u4E2D\u5E74", "\u6E29\u548C"], "\u6559\u8BED\u6587\u7684\u5973\u8001\u5E08, \u957F\u5F00\u886B\u52A0\u957F\u88D9, \u8BB2\u53F0\u4E0A\u4E00\u7AD9\u5C31\u662F\u4E00\u6574\u8282\u8BFE\u3002", {
    inner: "\u68C9\u8D28\u5706\u9886\u6253\u5E95\u886B",
    top: "\u53CA\u819D\u957F\u5F00\u886B, \u53E3\u888B\u88C5\u7C89\u7B14\u4E0EU\u76D8",
    bottom: "\u53CA\u8E1D\u957F\u88D9, \u9762\u6599\u5782\u5760\u4E0D\u663E\u817F\u578B",
    outerwear: "\u8584\u98CE\u8863, \u6625\u79CB\u4E24\u5B63\u5957\u5728\u5F00\u886B\u5916",
    legwear: "\u4E2D\u7B52\u68C9\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u978B, \u4E45\u7AD9\u4E0D\u7D2F",
    accessory: "\u62B1\u4E00\u645E\u4F5C\u4E1A\u672C, \u624B\u8155\u5957\u53D1\u5708"
  }, ["39-50", "51-65"]),
  c2("wld-edge-male-principal", "\u6821\u957F", "male", ["campus", "career"], ["\u6821\u957F", "\u9886\u5BFC", "\u6821\u56ED", "\u8001\u5E74", "\u5A01\u671B"], "\u5FEB\u9000\u4F11\u7684\u8001\u6821\u957F, \u6B63\u88C5\u4E00\u4E1D\u4E0D\u82DF, \u5FBD\u7AE0\u4E0E\u94A2\u7B14\u662F\u4EEA\u5F0F\u7684\u4E00\u90E8\u5206\u3002", {
    inner: "\u786C\u9886\u886C\u886B, \u9886\u53E3\u6263\u9F50\u5E76\u7CFB\u7D20\u51C0\u9886\u5E26",
    top: "\u5355\u6392\u6263\u897F\u88C5\u5916\u5957, \u80A9\u7EBF\u7AEF\u6B63, \u80F8\u888B\u522B\u6821\u5FBD",
    bottom: "\u897F\u88E4, \u88E4\u7EBF\u59CB\u7EC8\u538B\u5F97\u4F4F",
    outerwear: "\u53CA\u819D\u5462\u5B50\u5927\u8863, \u51AC\u65E5\u5FC5\u7A7F",
    legwear: "\u5546\u52A1\u957F\u889C",
    shoes: "\u7CFB\u5E26\u76AE\u978B, \u6BCF\u5468\u64E6\u4E00\u6B21",
    accessory: "\u80F8\u888B\u63D2\u94A2\u7B14, \u624B\u6301\u8BB2\u7A3F\u5939, \u8155\u8868\u662F\u65E7\u6B3E\u673A\u68B0\u8868"
  }, ["51-65", "66-80"]),
  c2("wld-edge-female-dorm-keeper", "\u5BBF\u7BA1\u963F\u59E8", "female", ["campus"], ["\u5BBF\u7BA1", "\u540E\u52E4", "\u6821\u56ED", "\u8001\u5E74", "\u8F83\u771F"], "\u5B88\u5BBF\u820D\u697C\u7684\u963F\u59E8, \u5DE5\u4F5C\u9A6C\u7532\u52A0\u8896\u5957, \u94A5\u5319\u4E32\u662F\u5979\u7684\u6743\u6756\u3002", {
    inner: "\u68C9\u8D28\u957F\u8896\u4E0A\u8863",
    top: "\u540E\u52E4\u5DE5\u4F5C\u9A6C\u7532, \u524D\u895F\u62C9\u94FE, \u80F8\u524D\u5370\u5C97\u4F4D\u5B57\u6837",
    bottom: "\u677E\u7D27\u8170\u4F11\u95F2\u957F\u88E4",
    outerwear: "\u539A\u68C9\u670D, \u503C\u591C\u73ED\u65F6\u5957\u4E0A",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u8F6F\u5E95\u9632\u6ED1\u68C9\u978B",
    accessory: "\u4E24\u53EA\u5E03\u8896\u5957, \u8170\u6302\u4E00\u5927\u4E32\u94A5\u5319, \u624B\u8FB9\u6C38\u8FDC\u6709\u767B\u8BB0\u672C"
  }, ["51-65", "66-80"]),
  c2("wld-edge-male-rural-teen", "\u4E61\u6751\u5C11\u5E74", "male", ["rural", "campus"], ["\u5C11\u5E74", "\u4E61\u6751", "\u5B66\u751F", "\u5014\u5F3A", "\u6E05\u8D2B"], "\u519C\u6751\u957F\u5927\u7684\u7537\u5B69, \u6821\u670D\u6D17\u5230\u53D1\u786C, \u88E4\u817F\u5E38\u5E74\u633D\u7740\u4E00\u622A\u3002", {
    inner: "\u6D17\u65E7\u7684\u5706\u9886T\u6064, \u9886\u53E3\u677E\u584C",
    top: "\u62C9\u94FE\u8FD0\u52A8\u6821\u670D\u4E0A\u8863, \u8896\u53E3\u78E8\u51FA\u6BDB\u8FB9",
    bottom: "\u540C\u6B3E\u8FD0\u52A8\u88E4, \u88E4\u817F\u633D\u5230\u5C0F\u817F\u809A",
    outerwear: "\u54E5\u54E5\u7A7F\u5269\u7684\u65E7\u5939\u514B, \u8896\u5B50\u504F\u957F",
    legwear: "\u68C9\u889C, \u811A\u8E1D\u5904\u78E8\u8584",
    shoes: "\u80F6\u5E95\u7403\u978B, \u978B\u5934\u5F00\u80F6\u7528\u80F6\u6C34\u7C98\u8FC7",
    accessory: "\u6D17\u65E7\u7684\u5355\u80A9\u5E03\u4E66\u5305, \u624B\u8155\u7F20\u4E00\u5708\u7948\u798F\u7EC6\u7EF3"
  }, ["16-20"]),
  c2("wld-edge-female-rural-teen", "\u4E61\u6751\u5C11\u5973", "female", ["rural", "campus"], ["\u5C11\u5973", "\u4E61\u6751", "\u5B66\u751F", "\u6734\u7D20", "\u8981\u5F3A"], "\u519C\u6751\u7684\u5973\u5B69, \u4E00\u6761\u9A6C\u5C3E\u624E\u5230\u5E95, \u8863\u670D\u5E72\u51C0\u4F46\u660E\u663E\u662F\u5F80\u5E74\u7684\u6B3E\u3002", {
    inner: "\u68C9\u8D28\u957F\u8896\u6253\u5E95\u886B",
    top: "\u9488\u7EC7\u6BDB\u8863, \u8896\u53E3\u8D77\u7403, \u4E0B\u6446\u7565\u957F",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u88E4\u811A\u6D17\u5F97\u53D1\u786C",
    outerwear: "\u8584\u68C9\u670D, \u62C9\u94FE\u62C9\u5230\u4E0B\u5DF4",
    legwear: "\u68C9\u889C",
    shoes: "\u5E03\u9762\u80F6\u5E95\u978B, \u978B\u5E2E\u6CBE\u7740\u5E72\u571F",
    accessory: "\u9AD8\u9A6C\u5C3E\u7528\u4E00\u6839\u76AE\u7B4B\u624E\u4F4F, \u80CC\u6D17\u65E7\u7684\u53CC\u80A9\u4E66\u5305"
  }, ["16-20"]),
  c2("wld-edge-male-caregiver-son", "\u7167\u62A4\u8001\u4EBA\u7684\u4E2D\u5E74\u513F\u5B50", "male", ["elder", "modern"], ["\u513F\u5B50", "\u4E2D\u5E74", "\u7167\u62A4", "\u75B2\u60EB", "\u5B5D\u987A"], "\u4E24\u5934\u987E\u7684\u4E2D\u5E74\u7537\u4EBA, \u8863\u7740\u5B9E\u7528\u5230\u8FD1\u4E4E\u5C06\u5C31, \u515C\u91CC\u6C38\u8FDC\u88C5\u7740\u836F\u76D2\u548C\u6302\u53F7\u5355\u3002", {
    inner: "\u7D20\u9762\u5706\u9886T\u6064",
    top: "\u62C9\u94FE\u8584\u5939\u514B, \u9886\u53E3\u677E\u584C, \u62C9\u94FE\u53EA\u62C9\u4E00\u534A",
    bottom: "\u677E\u7D27\u8170\u4F11\u95F2\u957F\u88E4",
    outerwear: "\u8FC7\u5B63\u7684\u539A\u5916\u5957, \u5728\u533B\u9662\u8D70\u5ECA\u91CC\u8131\u4E0B\u642D\u5728\u81C2\u5F2F",
    legwear: "\u4E2D\u7B52\u68C9\u889C",
    shoes: "\u8F6F\u5E95\u8FD0\u52A8\u978B, \u978B\u8DDF\u5916\u4FA7\u78E8\u504F",
    accessory: "\u659C\u630E\u5C0F\u5305\u88C5\u75C5\u5386\u4E0E\u836F\u76D2, \u624B\u673A\u5C4F\u5E55\u6709\u88C2\u7EB9"
  }, ["39-50", "51-65"]),
  c2("wld-edge-female-caregiver-daughter", "\u7167\u62A4\u8001\u4EBA\u7684\u4E2D\u5E74\u5973\u513F", "female", ["elder", "modern"], ["\u5973\u513F", "\u4E2D\u5E74", "\u7167\u62A4", "\u64CD\u52B3", "\u7EC6\u81F4"], "\u5728\u533B\u9662\u4E0E\u5BB6\u4E4B\u95F4\u8DD1\u7684\u4E2D\u5E74\u5973\u513F, \u4E00\u5207\u4ECE\u7B80, \u5934\u53D1\u968F\u624B\u4E00\u633D\u3002", {
    inner: "\u68C9\u8D28\u957F\u8896\u6253\u5E95\u886B",
    top: "\u5BBD\u677E\u9488\u7EC7\u886B, \u8896\u5B50\u968F\u65F6\u633D\u8D77",
    bottom: "\u5F39\u529B\u4F11\u95F2\u957F\u88E4, \u4FBF\u4E8E\u8E72\u8D77\u6400\u6276",
    outerwear: "\u8F7B\u4FBF\u77ED\u7FBD\u7ED2\u670D, \u53E3\u888B\u9F13\u7740\u4E00\u6C93\u5355\u636E",
    legwear: "\u68C9\u889C",
    shoes: "\u8F6F\u5E95\u5E73\u8DDF\u978B",
    accessory: "\u624B\u8155\u6302\u7740\u4FDD\u6E29\u676F\u888B, \u5934\u53D1\u7528\u6293\u5939\u968F\u624B\u633D\u8D77, \u5305\u91CC\u585E\u7740\u75C5\u5386\u672C"
  }, ["39-50", "51-65"]),
  c2("wld-edge-female-nurse-aide", "\u517B\u8001\u62A4\u5DE5", "female", ["elder", "career"], ["\u62A4\u5DE5", "\u7167\u62A4", "\u517B\u8001", "\u5E74\u8F7B", "\u4E13\u4E1A"], "\u517B\u8001\u673A\u6784\u7684\u5E74\u8F7B\u62A4\u5DE5, \u5206\u4F53\u5DE5\u4F5C\u670D\u52A0\u9632\u6ED1\u978B, \u5168\u8EAB\u4E3A\u6400\u6276\u4E0E\u5F2F\u8170\u8BBE\u8BA1\u3002", {
    inner: "\u77ED\u8896\u6253\u5E95\u886B",
    top: "\u5206\u4F53\u5F0F\u62A4\u7406\u5DE5\u4F5C\u670D\u4E0A\u8863, \u524D\u895F\u62C9\u94FE, \u80F8\u524D\u4E00\u4E2A\u660E\u888B",
    bottom: "\u540C\u6599\u5DE5\u4F5C\u88E4, \u677E\u7D27\u8170\u4FBF\u4E8E\u6D3B\u52A8",
    outerwear: "\u8584\u5916\u5957, \u51FA\u95E8\u63A8\u8F6E\u6905\u65F6\u5957\u4E0A",
    legwear: "\u68C9\u8D28\u4E2D\u7B52\u889C",
    shoes: "\u9632\u6ED1\u8F6F\u5E95\u5DE5\u4F5C\u978B",
    accessory: "\u80F8\u524D\u522B\u5DE5\u724C, \u8170\u95F4\u6302\u8BA1\u65F6\u5668, \u53E3\u888B\u63D2\u62A4\u7406\u8BB0\u5F55\u672C"
  }, ["21-28", "29-38"]),
  c2("wld-edge-male-senior-expert", "\u8FD4\u8058\u8001\u4E13\u5BB6", "male", ["career"], ["\u4E13\u5BB6", "\u8FD4\u8058", "\u8001\u5E74", "\u6743\u5A01", "\u804C\u573A"], "\u9000\u4F11\u540E\u88AB\u8FD4\u8058\u7684\u8001\u4E13\u5BB6, \u6B63\u88C5\u504F\u65E7\u4F46\u7248\u578B\u4ECD\u5728, \u8BB2\u8D77\u4E13\u4E1A\u773C\u795E\u53D1\u4EAE\u3002", {
    inner: "\u7D20\u9762\u886C\u886B, \u9886\u53E3\u6263\u9F50",
    top: "\u9488\u7EC7\u5F00\u886B\u7F69\u5728\u886C\u886B\u5916, \u624B\u8098\u5904\u7565\u8584",
    bottom: "\u76F4\u7B52\u897F\u88E4, \u8170\u56F4\u8F83\u5E74\u8F7B\u65F6\u653E\u5BBD\u4E86\u4E00\u5BF8",
    outerwear: "\u65E7\u6B3E\u897F\u88C5\u5916\u5957, \u80A9\u7EBF\u4ECD\u633A",
    legwear: "\u7F57\u7EB9\u957F\u889C",
    shoes: "\u8F6F\u5E95\u7CFB\u5E26\u76AE\u978B, \u811A\u80CC\u5904\u538B\u51FA\u4F7F\u7528\u75D5",
    accessory: "\u80F8\u888B\u63D2\u4E00\u652F\u65E7\u94A2\u7B14, \u624B\u6301\u725B\u76AE\u7EB8\u6587\u4EF6\u888B"
  }, ["66-80", "80+"]),
  c2("wld-edge-female-senior-expert", "\u8FD4\u8058\u5973\u6559\u6388", "female", ["career"], ["\u6559\u6388", "\u8FD4\u8058", "\u8001\u5E74", "\u5B66\u8005", "\u804C\u573A"], "\u4ECD\u5728\u5E26\u5B66\u751F\u7684\u8001\u6559\u6388, \u957F\u5F00\u886B\u52A0\u957F\u88E4, \u8BB2\u4E49\u4E0E\u4FDD\u6E29\u676F\u662F\u6807\u914D\u3002", {
    inner: "\u9AD8\u9886\u8584\u9488\u7EC7\u6253\u5E95",
    top: "\u53CA\u819D\u957F\u5F00\u886B, \u53E3\u888B\u88AB\u8BB2\u4E49\u6491\u5F97\u4E0B\u5782",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u9762\u6599\u67D4\u8F6F",
    outerwear: "\u8F7B\u8584\u7FBD\u7ED2\u5916\u5957, \u51AC\u65E5\u5957\u5728\u5F00\u886B\u5916",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u978B, \u978B\u5E95\u7EB9\u8DEF\u78E8\u5E73",
    accessory: "\u624B\u63D0\u5E03\u888B\u88C5\u8BB2\u4E49\u4E0E\u4FDD\u6E29\u676F"
  }, ["66-80", "80+"]),
  c2("wld-edge-male-period-teen", "\u5E74\u4EE3\u620F\u5C11\u5E74", "male", ["period"], ["\u5C11\u5E74", "\u5E74\u4EE3", "\u5B66\u751F", "\u9752\u6DA9", "\u65E7\u65F6"], "\u4E0A\u4E00\u4E2A\u5E74\u4EE3\u7684\u7537\u5B69, \u5E06\u5E03\u630E\u5305\u4E0E\u65E7\u7403\u978B, \u8863\u670D\u90FD\u662F\u5927\u4EBA\u6539\u5C0F\u7684\u3002", {
    inner: "\u68C9\u8D28\u5706\u9886\u6C57\u886B",
    top: "\u62C9\u94FE\u5916\u5957, \u7ACB\u9886, \u8896\u53E3\u7F57\u7EB9\u677E\u4E86",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u88E4\u811A\u662F\u5BB6\u91CC\u653E\u957F\u540E\u53C8\u6298\u8D77\u7684",
    outerwear: "\u539A\u68C9\u8884, \u51AC\u5929\u7A7F\u5F97\u9F13\u9F13\u56CA\u56CA",
    legwear: "\u624B\u7EC7\u68C9\u889C",
    shoes: "\u80F6\u5E95\u7403\u978B, \u978B\u5E26\u65AD\u8FC7\u6253\u4E86\u7ED3",
    accessory: "\u659C\u630E\u5E06\u5E03\u630E\u5305, \u77ED\u53D1\u526A\u5F97\u53C2\u5DEE"
  }, ["16-20"]),
  c2("wld-edge-female-period-elder", "\u5E74\u4EE3\u620F\u8001\u592A\u592A", "female", ["period", "elder"], ["\u8001\u592A\u592A", "\u5E74\u4EE3", "\u957F\u8F88", "\u65E7\u65F6", "\u6148\u7965"], "\u4E0A\u4E2A\u5E74\u4EE3\u7684\u8001\u592A\u592A, \u659C\u895F\u8902\u5B50\u914D\u68C9\u88E4, \u5934\u53D1\u4E00\u4E1D\u4E0D\u4E71\u5730\u633D\u5728\u8111\u540E\u3002", {
    inner: "\u68C9\u8D28\u9AD8\u9886\u5185\u8863",
    top: "\u659C\u895F\u76D8\u6263\u5E03\u8902, \u8863\u957F\u8FC7\u81C0, \u8896\u53E3\u504F\u7A84",
    bottom: "\u5BBD\u677E\u68C9\u88E4, \u88E4\u811A\u7528\u5E03\u5E26\u624E\u4F4F",
    outerwear: "\u5BF9\u895F\u68C9\u8884, \u51AC\u65E5\u52A0\u7A7F",
    legwear: "\u624B\u7EC7\u539A\u68C9\u889C",
    shoes: "\u81EA\u7EB3\u5E03\u978B, \u978B\u5E2E\u8D77\u76B1",
    accessory: "\u53D1\u9AFB\u5728\u8111\u540E\u633D\u7D27\u63D2\u4E00\u6839\u7C2A, \u8170\u7CFB\u56F4\u88D9, \u624B\u630E\u7AF9\u7BEE"
  }, ["66-80", "80+"]),
  c2("wld-fan-male-sage", "\u5854\u4E2D\u8001\u8D24\u8005", "male", ["fantasy"], ["\u8D24\u8005", "\u5927\u6CD5\u5E08", "\u8001\u5E74", "\u897F\u5E7B", "\u7384\u5E7B"], "\u6D3B\u4E86\u51E0\u767E\u5E74\u7684\u8001\u8D24\u8005, \u888D\u8EAB\u5C42\u5C42\u53E0\u53E0, \u957F\u987B\u4E0E\u6CD5\u6756\u6BD4\u4EBA\u8FD8\u6709\u540D\u3002", {
    inner: "\u5BBD\u8212\u957F\u5185\u888D",
    top: "\u53CA\u5730\u957F\u888D, \u901A\u4F53\u65E0\u6536\u8170, \u8863\u7F18\u7EC7\u8FDE\u7EED\u661F\u8C61\u7EB9",
    bottom: "\u888D\u6446\u5806\u53E0\u5728\u8DB3\u9762",
    outerwear: "\u539A\u91CD\u5916\u888D, \u515C\u5E3D\u6781\u5927, \u80A9\u90E8\u7F00\u661F\u7EB9\u62AB\u80A9",
    legwear: "\u539A\u5E03\u889C",
    shoes: "\u5E73\u5E95\u8F6F\u5C65",
    accessory: "\u957F\u987B\u5782\u81F3\u80F8\u53E3, \u624B\u6301\u9876\u7AEF\u5D4C\u77F3\u7684\u9AD8\u6756, \u8170\u60AC\u591A\u4E2A\u5377\u8F74\u7B52"
  }, ["66-80", "80+"]),
  c2("wld-edge-male-elder-grandson", "\u966A\u62A4\u5B59\u8F88", "male", ["elder", "modern"], ["\u5B59\u8F88", "\u9752\u5E74", "\u966A\u62A4", "\u4EB2\u60C5", "\u677E\u5F1B"], "\u966A\u7237\u7237\u5976\u5976\u770B\u75C5\u7684\u5E74\u8F7B\u5B59\u8F88, \u4E00\u8EAB\u8F7B\u4FBF, \u624B\u91CC\u5E38\u62CE\u7740\u8001\u4EBA\u7684\u4E1C\u897F\u3002", {
    inner: "\u7D20\u9762\u5706\u9886T\u6064",
    top: "\u8FDE\u5E3D\u536B\u8863, \u5E3D\u5B50\u5806\u5728\u9888\u540E",
    bottom: "\u76F4\u7B52\u4F11\u95F2\u957F\u88E4",
    outerwear: "\u8584\u5939\u514B, \u7CFB\u5728\u8170\u95F4\u6216\u642D\u5728\u81C2\u5F2F",
    legwear: "\u77ED\u68C9\u889C",
    shoes: "\u8F7B\u4FBF\u8FD0\u52A8\u978B",
    accessory: "\u53CC\u80A9\u5305\u88C5\u7740\u8001\u4EBA\u7684\u75C5\u5386\u4E0E\u6C34\u676F, \u624B\u8155\u6302\u7740\u53F7\u7801\u5355"
  }, ["16-20", "21-28", "29-38"]),
  c2("wld-edge-female-elder-granddaughter", "\u966A\u62A4\u5B59\u5973", "female", ["elder", "modern"], ["\u5B59\u8F88", "\u5C11\u5973", "\u966A\u62A4", "\u4EB2\u60C5", "\u4E56\u5DE7"], "\u653E\u5B66\u540E\u53BB\u533B\u9662\u966A\u8001\u4EBA\u7684\u5B59\u5973, \u6821\u670D\u5916\u968F\u624B\u5957\u4EF6\u5916\u5957, \u624B\u91CC\u62CE\u7740\u8001\u4EBA\u7684\u4E1C\u897F\u3002", {
    inner: "\u68C9\u8D28\u957F\u8896\u6253\u5E95\u886B",
    top: "\u5BBD\u677E\u9488\u7EC7\u6BDB\u8863, \u8896\u53E3\u957F\u8FC7\u624B\u80CC",
    bottom: "\u76F4\u7B52\u957F\u88E4, \u4FBF\u4E8E\u8DD1\u4E0A\u8DD1\u4E0B",
    outerwear: "\u8584\u6B3E\u77ED\u5916\u5957, \u62C9\u94FE\u53EA\u62C9\u4E00\u534A",
    legwear: "\u4E2D\u7B52\u68C9\u889C",
    shoes: "\u8F7B\u4FBF\u8FD0\u52A8\u978B",
    accessory: "\u53CC\u80A9\u5305\u4FA7\u888B\u63D2\u7740\u8001\u4EBA\u7684\u4FDD\u6E29\u676F, \u5934\u53D1\u624E\u6210\u4F4E\u9A6C\u5C3E"
  }, ["16-20", "21-28"]),
  // ================= 中式玄幻 / 神魔(fantasy + xianxia) =================
  c2("wld-myth-male-war-god", "\u4E0A\u53E4\u6218\u795E", "male", ["fantasy", "xianxia"], ["\u6218\u795E", "\u4E0A\u53E4", "\u795E\u65CF", "\u5A01\u538B", "\u7384\u5E7B"], "\u4E0A\u53E4\u9057\u7559\u7684\u6218\u795E, \u795E\u7532\u4E0E\u795E\u7EB9\u4E00\u4F53, \u7532\u9762\u7559\u7740\u4E0A\u53E4\u6218\u75D5\u4ECE\u4E0D\u4FEE\u8865\u3002", {
    inner: "\u8D34\u8EAB\u6218\u8863, \u7EC7\u8FDC\u53E4\u7B26\u6587",
    top: "\u6574\u5E45\u795E\u7532, \u80F8\u53E3\u4E00\u679A\u5706\u5F62\u795E\u7EB9, \u7532\u7247\u8FB9\u7F18\u4F5C\u517D\u9996\u72B6",
    bottom: "\u91CD\u7532\u6218\u88D9, \u5206\u7247\u5782\u5760, \u6BCF\u7247\u523B\u4E0D\u540C\u53E4\u7EB9",
    outerwear: "\u957F\u62AB\u98CE, \u81EA\u53CC\u80A9\u5782\u81F3\u8DB3\u540E, \u8FB9\u7F18\u7834\u635F\u4ECE\u4E0D\u7F1D\u8865",
    legwear: "\u7532\u7247\u62A4\u817F, \u5173\u8282\u5904\u9732\u51FA\u7B26\u6587\u7F1D\u9699",
    shoes: "\u539A\u91CD\u6218\u9774, \u9774\u9762\u523B\u7EB9",
    accessory: "\u989D\u7F00\u795E\u7EB9\u51A0, \u80CC\u8D1F\u5DE8\u578B\u5175\u5203, \u8155\u7F1A\u5BBD\u7532\u73AF"
  }, ["29-38", "39-50"]),
  c2("wld-myth-male-demon-king", "\u9B54\u65CF\u4E4B\u4E3B", "male", ["fantasy", "xianxia"], ["\u9B54\u65CF", "\u9B54\u738B", "\u538B\u8FEB", "\u90AA\u5F02", "\u7384\u5E7B"], "\u9B54\u65CF\u4E00\u65CF\u4E4B\u738B, \u9AA8\u8D28\u5916\u9AA8\u9ABC\u4E0E\u76AE\u9769\u4EA4\u53E0, \u8F6E\u5ED3\u5168\u662F\u5C16\u9510\u5411\u5916\u7684\u89D2\u3002", {
    inner: "\u8D34\u8EAB\u9AD8\u9886\u5185\u886C, \u9886\u53E3\u6536\u81F3\u4E0B\u988C",
    top: "\u9AA8\u8D28\u80F8\u94E0, \u808B\u72B6\u7ED3\u6784\u5916\u9732, \u80A9\u90E8\u7ACB\u8D77\u6570\u6839\u5C16\u89D2",
    bottom: "\u91CD\u53E0\u9CDE\u7247\u6218\u88D9, \u4E0B\u6446\u5448\u952F\u9F7F\u72B6",
    outerwear: "\u5DE8\u5E45\u6597\u7BF7, \u5185\u886C\u53E6\u63A5\u4E00\u5C42\u8584\u819C\u72B6\u6750\u8D28, \u5C55\u5F00\u65F6\u5982\u7FFC",
    legwear: "\u9CDE\u7247\u62A4\u817F",
    shoes: "\u5C16\u5934\u91CD\u9774, \u8DB3\u5C16\u5305\u94C1",
    accessory: "\u5934\u751F\u53CC\u89D2, \u6307\u7AEF\u6234\u5C16\u9510\u7532\u5957, \u80F8\u53E3\u60AC\u4E00\u679A\u9B54\u6838"
  }, ["29-38", "39-50"]),
  c2("wld-myth-male-dragon-kin", "\u9F99\u65CF\u5316\u5F62", "male", ["fantasy", "xianxia"], ["\u9F99\u65CF", "\u5316\u5F62", "\u5F02\u65CF", "\u50B2\u6162", "\u7384\u5E7B"], "\u5316\u4E3A\u4EBA\u5F62\u7684\u9F99\u65CF, \u9CDE\u7247\u81EA\u9888\u4FA7\u5EF6\u4F38\u5165\u8863\u9886, \u8863\u6599\u5E26\u9CDE\u72B6\u538B\u7EB9\u3002", {
    inner: "\u8D34\u8EAB\u8863, \u9886\u53E3\u4F4E\u5F00\u9732\u51FA\u9888\u4FA7\u9CDE\u7247",
    top: "\u4EA4\u9886\u957F\u8863, \u8863\u8EAB\u538B\u6EE1\u9CDE\u72B6\u6697\u7EB9, \u8170\u675F\u5BBD\u5E26",
    bottom: "\u5782\u5760\u957F\u88E4, \u4FA7\u7F1D\u5F00\u8869",
    outerwear: "\u5927\u5E45\u5916\u888D, \u540E\u6446\u5448\u7FFC\u72B6\u5F20\u5F00, \u8FB9\u7F18\u4F5C\u9CCD\u5F62",
    legwear: "\u5E03\u8D28\u62A4\u817F",
    shoes: "\u5C16\u5934\u957F\u9774, \u9774\u9762\u538B\u9CDE\u7EB9",
    accessory: "\u989D\u4FA7\u751F\u4E00\u5BF9\u77ED\u89D2, \u8033\u540E\u6709\u9CDE, \u8EAB\u540E\u53EF\u89C1\u5C3E\u5F71"
  }, ["21-28", "29-38"]),
  c2("wld-myth-male-shaman", "\u5DEB\u65CF\u5927\u796D\u53F8", "male", ["fantasy", "xianxia"], ["\u5DEB\u65CF", "\u796D\u53F8", "\u53E4\u8001", "\u8BE1\u79D8", "\u7384\u5E7B"], "\u5DEB\u65CF\u4E3B\u796D, \u517D\u9AA8\u4E0E\u7FBD\u6BDB\u5C42\u5C42\u5806\u53E0, \u6BCF\u4E00\u4EF6\u90FD\u662F\u796D\u4EEA\u6CD5\u5668\u3002", {
    inner: "\u517D\u76AE\u8D34\u8EAB\u5185\u886C",
    top: "\u591A\u5C42\u517D\u76AE\u5916\u8863, \u7F1D\u7EBF\u7C97\u5927, \u80F8\u524D\u7F00\u9AA8\u7247\u6392\u5217\u6210\u9635",
    bottom: "\u517D\u76AE\u957F\u88D9\u5F0F\u4E0B\u6446, \u5206\u6761\u5782\u843D",
    outerwear: "\u5DE8\u5927\u7FBD\u62AB, \u81EA\u80A9\u8986\u80CC, \u7FBD\u6BDB\u957F\u77ED\u4EA4\u9519",
    legwear: "\u76AE\u7EF3\u4EA4\u53C9\u7F20\u81F3\u819D",
    shoes: "\u517D\u76AE\u8F6F\u9774, \u8DB3\u8E1D\u7F00\u9AA8\u94C3",
    accessory: "\u9762\u8986\u517D\u9AA8\u9762\u5177, \u624B\u6301\u7F20\u7FBD\u6CD5\u6756, \u9888\u6302\u591A\u5C42\u9AA8\u7259\u4E32"
  }, ["39-50", "51-65"]),
  c2("wld-myth-male-holy-son", "\u795E\u65CF\u5723\u5B50", "male", ["fantasy", "xianxia"], ["\u795E\u65CF", "\u5723\u5B50", "\u9AD8\u6D01", "\u758F\u79BB", "\u7384\u5E7B"], "\u795E\u65CF\u5C11\u4E3B, \u8863\u6599\u8F7B\u8584\u8FD1\u4E4E\u65E0\u91CD\u91CF, \u7EB9\u6837\u5168\u90E8\u5BF9\u79F0\u3001\u65E0\u4E00\u5904\u968F\u610F\u3002", {
    inner: "\u534A\u900F\u8D34\u8EAB\u5185\u888D",
    top: "\u4EA4\u9886\u5E7F\u8896\u4E0A\u8863, \u9886\u7F18\u4E0E\u8896\u7F18\u7EC7\u5BF9\u79F0\u795E\u7EB9",
    bottom: "\u5782\u5760\u957F\u88F3, \u4E0B\u6446\u53CA\u5730\u4E0D\u89C1\u8DB3",
    outerwear: "\u901A\u4F53\u8584\u7EB1\u5916\u7F69, \u81EA\u80A9\u5782\u843D, \u884C\u8D70\u65F6\u6EDE\u540E\u534A\u62CD",
    legwear: "\u7EC6\u7EB1\u8DB3\u8863",
    shoes: "\u8F6F\u5E95\u4E91\u5C65",
    accessory: "\u989D\u5FC3\u4E00\u679A\u795E\u5370, \u80CC\u540E\u6D6E\u4E00\u5708\u5149\u73AF\u72B6\u9970\u7269, \u8155\u60AC\u957F\u6D41\u82CF"
  }, ["21-28", "29-38"]),
  c2("wld-myth-female-goddess", "\u795E\u5973", "female", ["fantasy", "xianxia"], ["\u795E\u5973", "\u795E\u65CF", "\u5723\u6D01", "\u7AEF\u5E84", "\u7384\u5E7B"], "\u53D7\u4F9B\u5949\u7684\u795E\u5973, \u5C42\u7EB1\u53E0\u7F69\u3001\u7EB9\u6837\u5BF9\u79F0, \u4E00\u4E3E\u4E00\u52A8\u90FD\u50CF\u4EEA\u5178\u7684\u4E00\u90E8\u5206\u3002", {
    inner: "\u8F7B\u7EB1\u62B9\u80F8, \u8FB9\u7F18\u7F00\u7EC6\u73E0",
    top: "\u5E7F\u8896\u4E0A\u8966, \u80A9\u8986\u5BF9\u79F0\u4E91\u80A9, \u9886\u53E3\u6B63\u5706",
    bottom: "\u591A\u5C42\u66F3\u5730\u957F\u88D9, \u88D9\u7F18\u7EC7\u661F\u8C61\u7EB9",
    outerwear: "\u534A\u900F\u957F\u7EB1, \u81EA\u53CC\u80A9\u5782\u843D\u957F\u8FC7\u88D9\u6446",
    legwear: "\u7EC6\u7EB1\u8DB3\u8863",
    shoes: "\u8F6F\u5E95\u7FD8\u5934\u5C65",
    accessory: "\u9AD8\u51A0\u5782\u73E0\u5E18\u906E\u9762, \u989D\u5FC3\u82B1\u94BF, \u8155\u60AC\u957F\u7EB1\u5E26"
  }, ["21-28", "29-38"]),
  c2("wld-myth-female-demoness", "\u9B54\u65CF\u5996\u59EC", "female", ["fantasy", "xianxia"], ["\u9B54\u65CF", "\u5996\u59EC", "\u5996\u5F02", "\u5371\u9669", "\u7384\u5E7B"], "\u9B54\u65CF\u7684\u5973\u6027\u5F3A\u8005, \u526A\u88C1\u8D34\u8EAB\u3001\u5F00\u53E3\u6781\u591A, \u9AA8\u9970\u4E0E\u5C16\u89D2\u628A\u653B\u51FB\u6027\u5199\u5728\u5916\u5F62\u4E0A\u3002", {
    inner: "\u8D34\u8EAB\u675F\u80F8, \u8FB9\u7F18\u4F5C\u5C16\u9F7F\u72B6",
    top: "\u4E0D\u5BF9\u79F0\u675F\u8EAB\u4E0A\u8863, \u4E00\u4FA7\u8986\u9AA8\u8D28\u62A4\u80A9, \u53E6\u4E00\u4FA7\u5168\u88F8\u80A9\u7EBF",
    bottom: "\u9AD8\u5F00\u8869\u957F\u88D9, \u4E00\u4FA7\u5F00\u81F3\u80EF, \u5185\u886C\u7D27\u8EAB\u88E4",
    outerwear: "\u8584\u819C\u8D28\u5730\u62AB\u98CE, \u5C55\u5F00\u65F6\u5448\u7FFC\u72B6",
    legwear: "\u957F\u7B52\u62A4\u817F, \u5916\u8986\u9CDE\u7247",
    shoes: "\u5C16\u5934\u7EC6\u8DDF\u957F\u9774",
    accessory: "\u989D\u751F\u5F2F\u89D2, \u5C3E\u9970\u5782\u5730, \u6307\u7AEF\u6234\u5C16\u7532\u5957"
  }, ["21-28", "29-38"]),
  c2("wld-myth-female-shaman", "\u5DEB\u65CF\u5973\u796D", "female", ["fantasy", "xianxia"], ["\u5DEB\u65CF", "\u5973\u796D", "\u795E\u79D8", "\u539F\u59CB", "\u7384\u5E7B"], "\u5DEB\u65CF\u7684\u5973\u6027\u796D\u53F8, \u7EC7\u7269\u7C97\u7C9D\u3001\u9970\u7269\u5BC6\u96C6, \u8D70\u52A8\u65F6\u9AA8\u94C3\u4E0E\u8D1D\u58F3\u4F5C\u54CD\u3002", {
    inner: "\u7C97\u7EC7\u8D34\u8EAB\u77ED\u8863",
    top: "\u4EA4\u53E0\u5F0F\u5916\u8863, \u7CFB\u5E26\u5728\u8170\u4FA7, \u80F8\u524D\u7F00\u8D1D\u58F3\u6392\u5217\u6210\u4E32",
    bottom: "\u591A\u5C42\u6D41\u82CF\u957F\u88D9, \u88D9\u6446\u5760\u9AA8\u73E0",
    outerwear: "\u517D\u76AE\u62AB\u80A9, \u8FB9\u7F18\u7F00\u7FBD",
    legwear: "\u9EBB\u7EF3\u7F20\u817F",
    shoes: "\u8D64\u8DB3\u6216\u8F6F\u76AE\u8DB3\u8863",
    accessory: "\u989D\u9970\u9AA8\u73AF, \u9762\u7ED8\u65CF\u7EB9, \u624B\u6301\u7F20\u5E03\u77ED\u6756"
  }, ["29-38", "39-50"]),
  c2("wld-myth-female-beast-heir", "\u517D\u795E\u540E\u88D4", "female", ["fantasy", "xianxia"], ["\u517D\u795E", "\u5F02\u65CF", "\u91CE\u6027", "\u5F3A\u5065", "\u7384\u5E7B"], "\u7EE7\u627F\u517D\u795E\u8840\u8109\u7684\u5973\u5B50, \u76AE\u6BDB\u4E0E\u5229\u722A\u662F\u5929\u751F\u7684, \u8863\u7269\u53EA\u4F5C\u6700\u4F4E\u9650\u5EA6\u7684\u906E\u8986\u3002", {
    inner: "\u76AE\u8D28\u675F\u80F8",
    top: "\u517D\u76AE\u77ED\u4E0A\u8863, \u4E00\u4FA7\u7559\u51FA\u88F8\u9732\u80A9\u80CC, \u7F1D\u7EBF\u4EA4\u53C9",
    bottom: "\u517D\u76AE\u77ED\u88D9\u5916\u63A5\u7ED1\u817F",
    outerwear: "\u6574\u5F20\u517D\u76AE\u62AB\u98CE, \u517D\u9996\u8986\u4E8E\u5934\u9876",
    legwear: "\u76AE\u7EF3\u7F20\u81F3\u5927\u817F",
    shoes: "\u517D\u76AE\u8F6F\u9774, \u9774\u53E3\u7FFB\u6BDB",
    accessory: "\u9888\u6302\u5229\u722A\u4E32, \u8033\u540E\u751F\u517D\u8033, \u6307\u7532\u5448\u5929\u7136\u5C16\u722A\u72B6"
  }, ["21-28", "29-38"]),
  c2("wld-myth-female-fallen", "\u5815\u795E\u4F7F\u5F92", "female", ["fantasy", "xianxia"], ["\u5815\u795E", "\u4F7F\u5F92", "\u7834\u788E", "\u54C0\u8273", "\u7384\u5E7B"], "\u5815\u843D\u7684\u795E\u804C\u8005, \u5723\u888D\u88AB\u6495\u88C2\u540E\u53C8\u80E1\u4E71\u7F20\u56DE\u8EAB\u4E0A, \u7834\u635F\u672C\u8EAB\u6210\u4E86\u9020\u578B\u3002", {
    inner: "\u6B8B\u7834\u8D34\u8EAB\u957F\u8863",
    top: "\u539F\u672C\u5BF9\u79F0\u7684\u5723\u888D\u4E0A\u8EAB, \u4E00\u4FA7\u5B8C\u597D\u4E00\u4FA7\u6495\u88C2\u5782\u843D",
    bottom: "\u957F\u88D9\u4E0B\u6446\u6495\u6210\u6761\u72B6, \u62D6\u66F3\u65F6\u6563\u5F00",
    outerwear: "\u65AD\u88C2\u7684\u7FBD\u62AB, \u53EA\u5269\u5355\u4FA7",
    legwear: "\u5E03\u6761\u7F20\u817F\u81F3\u5927\u817F",
    shoes: "\u8D64\u8DB3, \u8DB3\u8E1D\u7F20\u5E03\u5E26",
    accessory: "\u989D\u9970\u65AD\u88C2\u6210\u534A, \u773C\u8986\u4E00\u6761\u5E03\u5E26, \u624B\u6301\u6298\u65AD\u7684\u6743\u6756"
  }, ["21-28", "29-38"]),
  // ================= 西式奇幻补充(fantasy) =================
  c2("wld-fan-male-bard", "\u541F\u6E38\u8BD7\u4EBA", "male", ["fantasy"], ["\u541F\u6E38\u8BD7\u4EBA", "\u6E38\u5386", "\u8F7B\u4F7B", "\u897F\u5E7B", "\u5947\u5E7B"], "\u8D70\u5230\u54EA\u5531\u5230\u54EA\u7684\u8BD7\u4EBA, \u5C42\u6B21\u591A\u3001\u914D\u9970\u6742, \u8863\u7740\u6BD4\u8C01\u90FD\u82B1\u54E8\u3002", {
    inner: "\u8377\u53F6\u8FB9\u8896\u886C\u886B, \u8896\u53E3\u6781\u84EC",
    top: "\u77ED\u6B3E\u675F\u8170\u9A6C\u7532, \u524D\u895F\u7CFB\u4EA4\u53C9\u7EF3\u5E26",
    bottom: "\u5408\u8EAB\u957F\u88E4, \u819D\u4E0B\u675F\u8FDB\u9774\u7B52",
    outerwear: "\u53CA\u819D\u6597\u7BF7, \u5185\u886C\u53E6\u63A5\u4E00\u5C42\u649E\u6599, \u8D70\u52A8\u65F6\u7FFB\u51FA",
    legwear: "\u957F\u7B52\u889C",
    shoes: "\u7FFB\u53E3\u9AD8\u7B52\u9774",
    accessory: "\u63D2\u7FBD\u8F6F\u5E3D, \u80CC\u5F26\u4E50\u5668, \u8170\u6302\u591A\u4E2A\u5C0F\u888B"
  }, ["21-28", "29-38"]),
  c2("wld-fan-male-dwarf-smith", "\u77EE\u4EBA\u5DE5\u5320", "male", ["fantasy"], ["\u77EE\u4EBA", "\u5DE5\u5320", "\u953B\u9020", "\u897F\u5E7B", "\u5947\u5E7B"], "\u77ED\u5C0F\u7CBE\u608D\u7684\u77EE\u4EBA\u5320\u5E08, \u76AE\u9769\u4E0E\u94C6\u9489\u5806\u6EE1\u5168\u8EAB, \u957F\u987B\u7F16\u6210\u8FAB\u5B50\u3002", {
    inner: "\u7C97\u7EC7\u539A\u5185\u886B, \u8896\u53E3\u5377\u8D77",
    top: "\u76AE\u8D28\u62A4\u80F8, \u94C6\u9489\u5BC6\u6392, \u80A9\u90E8\u52A0\u53CC\u5C42\u76AE\u7247",
    bottom: "\u539A\u5DE5\u88C5\u88E4, \u88E4\u817F\u5BBD\u800C\u77ED",
    outerwear: "\u539A\u76AE\u56F4\u88D9, \u81EA\u80F8\u81F3\u819D, \u6EE1\u5E03\u953B\u6253\u70EB\u75D5",
    legwear: "\u539A\u7ED2\u62A4\u817F",
    shoes: "\u539A\u5E95\u94C1\u5934\u77ED\u9774",
    accessory: "\u957F\u987B\u7F16\u6210\u6570\u80A1\u8FAB\u5E76\u7F00\u73AF\u6263, \u8170\u6302\u953B\u9524\u4E0E\u91CF\u5177"
  }, ["39-50", "51-65"]),
  c2("wld-fan-male-summoner", "\u53EC\u5524\u5E08", "male", ["fantasy"], ["\u53EC\u5524\u5E08", "\u6CD5\u5E08", "\u5951\u7EA6", "\u897F\u5E7B", "\u5947\u5E7B"], "\u4E0E\u5F02\u754C\u751F\u7269\u7ACB\u5951\u7684\u53EC\u5524\u5E08, \u888D\u8EAB\u6EE1\u662F\u5951\u7EA6\u7EB9\u4E0E\u9501\u94FE\u72B6\u88C5\u9970\u3002", {
    inner: "\u9AD8\u9886\u8D34\u8EAB\u5185\u888D",
    top: "\u4E0D\u5BF9\u79F0\u957F\u888D, \u4E00\u4FA7\u957F\u53CA\u8E1D\u4E00\u4FA7\u4EC5\u53CA\u819D, \u8863\u8EAB\u7EC7\u5951\u7EA6\u73AF\u7EB9",
    bottom: "\u4FEE\u8EAB\u957F\u88E4, \u5916\u8986\u94FE\u72B6\u9970\u5E26",
    outerwear: "\u539A\u91CD\u5916\u888D, \u9886\u53E3\u7ACB\u8D77, \u80A9\u90E8\u5782\u591A\u80A1\u9501\u94FE",
    legwear: "\u76AE\u8D28\u62A4\u817F",
    shoes: "\u9AD8\u7B52\u6263\u5E26\u9774",
    accessory: "\u624B\u80CC\u70D9\u5951\u7EA6\u5370, \u8170\u60AC\u53EC\u5524\u5377\u8F74\u4E0E\u517D\u9AA8\u6263"
  }, ["21-28", "29-38"]),
  c2("wld-fan-male-dark-ranger", "\u9ED1\u6697\u6E38\u4FA0", "male", ["fantasy"], ["\u6E38\u4FA0", "\u6697\u5F71", "\u730E\u624B", "\u897F\u5E7B", "\u5947\u5E7B"], "\u5728\u6697\u5904\u72E9\u730E\u7684\u6E38\u4FA0, \u901A\u4F53\u54D1\u5149\u65E0\u53CD\u5149\u4EF6, \u515C\u5E3D\u538B\u5230\u770B\u4E0D\u89C1\u773C\u775B\u3002", {
    inner: "\u8D34\u8EAB\u957F\u8896\u5185\u886C, \u54D1\u5149\u9762\u6599",
    top: "\u8F7B\u76AE\u7532, \u8868\u9762\u4F5C\u78E8\u7802\u5904\u7406, \u80F8\u524D\u4EA4\u53C9\u4E24\u6761\u7BAD\u888B\u5E26",
    bottom: "\u7D27\u8EAB\u957F\u88E4, \u819D\u4FA7\u7ED1\u77ED\u5203",
    outerwear: "\u53CA\u819D\u5E26\u515C\u5E3D\u6597\u7BF7, \u5185\u4FA7\u7F1D\u591A\u4E2A\u6697\u888B",
    legwear: "\u76AE\u8D28\u7ED1\u817F",
    shoes: "\u8F6F\u5E95\u730E\u9774, \u978B\u5E95\u7EB9\u8DEF\u6781\u6D45",
    accessory: "\u534A\u9762\u906E\u5DFE, \u80CC\u8D1F\u957F\u5F13, \u81C2\u7F1A\u62A4\u8155\u4E0E\u7BAD\u6263"
  }, ["29-38", "39-50"]),
  c2("wld-fan-female-valkyrie", "\u5973\u6B66\u795E", "female", ["fantasy"], ["\u5973\u6B66\u795E", "\u6218\u58EB", "\u795E\u4F7F", "\u897F\u5E7B", "\u5947\u5E7B"], "\u6218\u573A\u4E0A\u5F15\u6E21\u4EA1\u9B42\u7684\u5973\u6B66\u795E, \u7532\u7247\u4FEE\u957F\u5982\u7FBD, \u80CC\u540E\u6709\u7FFC\u72B6\u7ED3\u6784\u3002", {
    inner: "\u9501\u73AF\u8F6F\u7532\u5185\u886C",
    top: "\u5408\u8EAB\u80F8\u7532, \u7532\u7247\u4F5C\u7FBD\u72B6\u5C42\u53E0, \u80A9\u7532\u5411\u4E0A\u626C\u8D77",
    bottom: "\u7532\u88D9\u5206\u7247\u81F3\u819D, \u5185\u886C\u7D27\u8EAB\u88E4",
    outerwear: "\u80CC\u540E\u56FA\u5B9A\u7684\u7FFC\u72B6\u88C5\u7F6E, \u7531\u957F\u7FBD\u4E0E\u91D1\u5C5E\u9AA8\u67B6\u6784\u6210",
    legwear: "\u957F\u7B52\u7532\u7247\u62A4\u817F",
    shoes: "\u5E26\u7FFC\u9970\u7684\u6218\u9774",
    accessory: "\u5934\u6234\u7FFC\u72B6\u4FA7\u51A0, \u957F\u53D1\u7F16\u6210\u6218\u8FAB, \u6301\u957F\u67C4\u77DB"
  }, ["21-28", "29-38"]),
  c2("wld-fan-female-blade-dancer", "\u5251\u821E\u8005", "female", ["fantasy"], ["\u5251\u821E", "\u6218\u58EB", "\u7075\u52A8", "\u897F\u5E7B", "\u5947\u5E7B"], "\u4EE5\u821E\u59FF\u5FA1\u5251\u7684\u6218\u58EB, \u8863\u6599\u8F7B\u5230\u80FD\u968F\u52A8\u4F5C\u626C\u8D77, \u5374\u5904\u5904\u6709\u62A4\u5177\u3002", {
    inner: "\u8D34\u8EAB\u675F\u80F8\u5185\u886C",
    top: "\u77ED\u6B3E\u675F\u8170\u4E0A\u8863, \u9732\u8170, \u8896\u4E3A\u53EF\u62C6\u5378\u7684\u98D8\u5E26\u5F0F",
    bottom: "\u5206\u7247\u5F0F\u77ED\u88D9, \u6BCF\u7247\u72EC\u7ACB\u98D8\u52A8, \u5185\u886C\u7D27\u8EAB\u77ED\u88E4",
    outerwear: "\u534A\u8EAB\u8F7B\u7532, \u53EA\u62A4\u5355\u4FA7\u80A9\u4E0E\u524D\u81C2",
    legwear: "\u8FC7\u819D\u957F\u889C, \u5916\u7F1A\u4EA4\u53C9\u76AE\u5E26",
    shoes: "\u8F6F\u5E95\u821E\u6218\u9774, \u978B\u5E95\u6781\u8584",
    accessory: "\u9AD8\u9A6C\u5C3E\u7F00\u957F\u98D8\u5E26, \u8170\u95F4\u53CC\u77ED\u5251\u4EA4\u53C9\u60AC\u6302"
  }, ["16-20", "21-28"]),
  c2("wld-fan-female-half-elf", "\u534A\u7CBE\u7075\u6E38\u4FA0", "female", ["fantasy"], ["\u534A\u7CBE\u7075", "\u6E38\u4FA0", "\u6797\u5730", "\u897F\u5E7B", "\u5947\u5E7B"], "\u534A\u4EBA\u534A\u7CBE\u7075\u7684\u6E38\u4FA0, \u81EA\u7136\u6750\u8D28\u4E0E\u8F7B\u7532\u6DF7\u7528, \u8033\u5C16\u662F\u552F\u4E00\u7684\u975E\u4EBA\u7279\u5F81\u3002", {
    inner: "\u8D34\u8EAB\u8F6F\u8D28\u5185\u886C",
    top: "\u659C\u895F\u77ED\u4E0A\u8863, \u538B\u53F6\u8109\u7EB9, \u80A9\u8986\u8584\u76AE\u62A4\u7247",
    bottom: "\u4FEE\u8EAB\u957F\u88E4, \u819D\u90E8\u7F1D\u52A0\u539A\u8F6F\u57AB",
    outerwear: "\u53CA\u819D\u65E0\u8896\u7F69\u8863, \u4E24\u4FA7\u5F00\u8869, \u8FB9\u7F18\u4F5C\u53F6\u5C16\u72B6",
    legwear: "\u85E4\u7F16\u7ED1\u817F",
    shoes: "\u8F6F\u5E95\u77ED\u9774",
    accessory: "\u5C16\u8033, \u957F\u53D1\u7F16\u5165\u7EC6\u679D\u4E0E\u7FBD, \u80CC\u77ED\u5F13\u4E0E\u836F\u56CA"
  }, ["21-28", "29-38"]),
  c2("wld-fan-female-young-summoner", "\u5C11\u5973\u53EC\u5524\u5E08", "female", ["fantasy"], ["\u53EC\u5524\u5E08", "\u5C11\u5973", "\u5B66\u5F92", "\u897F\u5E7B", "\u5947\u5E7B"], "\u8FD8\u5728\u5B66\u5951\u7EA6\u7684\u5C11\u5973\u53EC\u5524\u5E08, \u888D\u5B50\u660E\u663E\u504F\u5927, \u8896\u5B50\u957F\u8FC7\u624B\u80CC\u3002", {
    inner: "\u8D34\u8EAB\u957F\u8896\u5185\u886C",
    top: "\u5BBD\u5927\u957F\u888D\u4E0A\u8EAB, \u80A9\u7EBF\u6ED1\u843D, \u8170\u95F4\u7528\u5BBD\u5E26\u52D2\u51FA\u5F62\u72B6",
    bottom: "\u888D\u6446\u53CA\u5C0F\u817F, \u5185\u886C\u8FC7\u819D\u957F\u889C",
    outerwear: "\u5E26\u5927\u515C\u5E3D\u7684\u77ED\u62AB\u98CE, \u515C\u5E3D\u5E38\u76D6\u4F4F\u534A\u5F20\u8138",
    legwear: "\u8FC7\u819D\u957F\u889C, \u4E00\u53EA\u6ED1\u843D\u81F3\u8E1D",
    shoes: "\u5706\u5934\u642D\u6263\u77ED\u9774",
    accessory: "\u62B1\u4E00\u672C\u6BD4\u624B\u8FD8\u5927\u7684\u5951\u7EA6\u4E66, \u8170\u6302\u591A\u679A\u517D\u5F62\u6302\u5760"
  }, ["16-20"]),
  // ================= 赛博朋克(fantasy: 近未来 / 义体 / 街头) =================
  c2("wld-cyb-male-hacker", "\u4E49\u4F53\u9ED1\u5BA2", "male", ["fantasy"], ["\u9ED1\u5BA2", "\u4E49\u4F53", "\u8D5B\u535A", "\u8857\u5934", "\u79D1\u5E7B"], "\u9760\u8111\u673A\u63A5\u53E3\u5403\u996D\u7684\u9ED1\u5BA2, \u540E\u9888\u4E0E\u592A\u9633\u7A74\u6709\u63A5\u53E3, \u5916\u5957\u5185\u4FA7\u5168\u662F\u8D70\u7EBF\u3002", {
    inner: "\u8D34\u8EAB\u529F\u80FD\u957F\u8896\u886B, \u9762\u6599\u5E26\u7EC6\u5BC6\u7F51\u683C\u538B\u7EB9",
    top: "\u591A\u53E3\u888B\u6218\u672F\u9A6C\u7532, \u524D\u895F\u4EA4\u53C9\u675F\u5E26, \u53E3\u888B\u63D2\u6570\u636E\u5361",
    bottom: "\u4FEE\u8EAB\u673A\u80FD\u957F\u88E4, \u5927\u817F\u4FA7\u6302\u53EF\u62C6\u5378\u786C\u58F3\u888B",
    outerwear: "\u957F\u6B3E\u98CE\u8863, \u5185\u886C\u7F1D\u8D70\u7EBF\u4E0E\u53D1\u5149\u5BFC\u5E26, \u9886\u53E3\u7ACB\u8D77",
    legwear: "\u538B\u7F29\u957F\u889C",
    shoes: "\u539A\u5E95\u673A\u80FD\u9774, \u978B\u4FA7\u6709\u5D4C\u706F\u69FD",
    accessory: "\u540E\u9888\u4E0E\u592A\u9633\u7A74\u5D4C\u63A5\u53E3, \u5355\u773C\u8986\u6570\u636E\u76EE\u955C, \u8155\u6234\u591A\u5C4F\u7EC8\u7AEF"
  }, ["21-28", "29-38"]),
  c2("wld-cyb-female-netrunner", "\u7F51\u7EDC\u6F5C\u884C\u8005", "female", ["fantasy"], ["\u6F5C\u884C\u8005", "\u9ED1\u5BA2", "\u4E49\u4F53", "\u8D5B\u535A", "\u79D1\u5E7B"], "\u5E38\u5E74\u6CE1\u5728\u7F51\u91CC\u7684\u5973\u6F5C\u884C\u8005, \u526A\u88C1\u8D34\u8EAB\u3001\u65E0\u4E00\u5904\u677E\u57AE, \u5934\u53D1\u5243\u51FA\u63A5\u53E3\u533A\u3002", {
    inner: "\u4E00\u4F53\u5F0F\u8D34\u8EAB\u673A\u80FD\u8863, \u65E0\u63A5\u7F1D",
    top: "\u77ED\u6B3E\u786C\u58F3\u62A4\u80F8, \u4FA7\u9762\u7559\u6563\u70ED\u5F00\u53E3",
    bottom: "\u9AD8\u8170\u7D27\u8EAB\u957F\u88E4, \u819D\u4FA7\u5D4C\u786C\u8D28\u62A4\u7247",
    outerwear: "\u77ED\u6B3E\u673A\u80FD\u5939\u514B, \u8896\u5B50\u53EF\u6574\u6BB5\u62C6\u4E0B",
    legwear: "\u8FC7\u819D\u538B\u7F29\u889C, \u889C\u53E3\u4E00\u5708\u5BFC\u7EBF",
    shoes: "\u539A\u5E95\u77ED\u9774, \u978B\u8DDF\u5185\u5D4C\u7535\u6E90\u4ED3",
    accessory: "\u534A\u8FB9\u5934\u76AE\u5243\u51FA\u63A5\u53E3\u7EB9\u8DEF, \u8033\u540E\u5D4C\u63D2\u53E3, \u9762\u6234\u534A\u7F69\u5F0F\u76EE\u955C"
  }, ["21-28", "29-38"]),
  c2("wld-cyb-male-street-samurai", "\u8857\u5934\u6539\u9020\u6B66\u58EB", "male", ["fantasy"], ["\u6539\u9020\u4EBA", "\u6253\u624B", "\u8D5B\u535A", "\u8857\u5934", "\u79D1\u5E7B"], "\u6574\u6761\u624B\u81C2\u6362\u6210\u4E49\u80A2\u7684\u8857\u5934\u6253\u624B, \u673A\u68B0\u5173\u8282\u5168\u90E8\u88F8\u9732\u4E0D\u52A0\u5916\u58F3\u3002", {
    inner: "\u65E0\u8896\u80CC\u5FC3, \u9732\u51FA\u4E49\u4F53\u63A5\u53E3",
    top: "\u786C\u58F3\u62A4\u80F8, \u53EA\u8986\u524D\u8EAB, \u80CC\u90E8\u7528\u4EA4\u53C9\u5E26\u56FA\u5B9A",
    bottom: "\u6218\u672F\u957F\u88E4, \u591A\u4E2A\u786C\u58F3\u53E3\u888B",
    outerwear: "\u65E0\u8896\u957F\u5916\u5957, \u4E0B\u6446\u53CA\u5C0F\u817F, \u4FBF\u4E8E\u62BD\u5200",
    legwear: "\u62A4\u80EB\u5916\u58F3",
    shoes: "\u91CD\u578B\u4F5C\u6218\u9774, \u978B\u5934\u5305\u786C\u58F3",
    accessory: "\u6574\u6761\u673A\u68B0\u4E49\u81C2\u5173\u8282\u5916\u9732, \u80CC\u8D1F\u957F\u5203, \u9888\u6302\u9632\u5C18\u9762\u7F69"
  }, ["29-38", "39-50"]),
  c2("wld-cyb-male-corp-security", "\u4F01\u4E1A\u5B89\u4FDD", "male", ["fantasy", "career"], ["\u5B89\u4FDD", "\u4F01\u4E1A", "\u8D5B\u535A", "\u5236\u670D", "\u79D1\u5E7B"], "\u5927\u4F01\u4E1A\u7684\u6B66\u88C5\u5B89\u4FDD, \u5236\u670D\u4E0E\u5916\u9AA8\u9ABC\u4E00\u4F53, \u5FBD\u6807\u538B\u5728\u80F8\u53E3\u3002", {
    inner: "\u8D34\u8EAB\u6218\u672F\u5185\u886C, \u9AD8\u9886",
    top: "\u5236\u5F0F\u62A4\u7532\u4E0A\u8863, \u80F8\u53E3\u538B\u4F01\u4E1A\u5FBD\u6807, \u80A9\u90E8\u52A0\u88C5\u5916\u9AA8\u9ABC\u652F\u67B6",
    bottom: "\u6218\u672F\u957F\u88E4, \u819D\u90E8\u5D4C\u786C\u8D28\u62A4\u7247",
    outerwear: "\u534A\u8EAB\u5916\u9AA8\u9ABC\u80CC\u67B6, \u6CBF\u810A\u67F1\u5EF6\u4F38\u81F3\u8170",
    legwear: "\u62A4\u80EB\u5916\u58F3",
    shoes: "\u94A2\u5934\u6218\u672F\u9774",
    accessory: "\u5168\u8986\u5F0F\u9762\u7F69\u5E26\u5355\u6761\u89C6\u7A97, \u8170\u6302\u5236\u5F0F\u6B66\u5668\u4E0E\u8BC6\u522B\u724C"
  }, ["29-38", "39-50"]),
  c2("wld-cyb-male-ripperdoc", "\u8857\u5934\u4E49\u4F53\u533B\u751F", "male", ["fantasy"], ["\u8857\u533B", "\u4E49\u4F53\u533B\u751F", "\u8D5B\u535A", "\u5730\u4E0B", "\u79D1\u5E7B"], "\u5728\u540E\u5DF7\u505A\u4E49\u4F53\u624B\u672F\u7684\u533B\u751F, \u7F69\u8863\u6CBE\u6EE1\u6CB9\u6E0D, \u5DE5\u5177\u6302\u4E86\u6EE1\u5899\u4E5F\u6302\u6EE1\u8EAB\u3002", {
    inner: "\u6D17\u65E7\u77ED\u8896\u886B",
    top: "\u591A\u53E3\u888B\u5DE5\u4F5C\u886C\u886B, \u8896\u5B50\u5377\u81F3\u8098\u4E0A, \u524D\u895F\u63D2\u6570\u652F\u5668\u68B0",
    bottom: "\u8010\u78E8\u5DE5\u88C5\u957F\u88E4",
    outerwear: "\u53CA\u819D\u624B\u672F\u7F69\u8863, \u524D\u895F\u6EE1\u662F\u6CB9\u6E0D\u4E0E\u70E7\u707C\u70B9",
    legwear: "\u539A\u68C9\u889C",
    shoes: "\u9632\u6ED1\u8F6F\u5E95\u5DE5\u978B",
    accessory: "\u9888\u6302\u624B\u672F\u706F, \u8170\u7F20\u5DE5\u5177\u5377, \u5934\u6234\u591A\u76EE\u653E\u5927\u955C(\u975E\u624B\u672F\u65F6\u7701\u7565)"
  }, ["39-50", "51-65"]),
  c2("wld-cyb-female-smuggler", "\u8D70\u79C1\u8D29", "female", ["fantasy"], ["\u8D70\u79C1", "\u8D29\u5B50", "\u8D5B\u535A", "\u8857\u5934", "\u79D1\u5E7B"], "\u5728\u76D1\u7BA1\u4E4B\u5916\u8DD1\u8D27\u7684\u5973\u4EBA, \u4E00\u8EAB\u76AE\u9769\u4E0E\u786C\u58F3\u7BB1\u5305, \u968F\u65F6\u80FD\u8DD1\u3002", {
    inner: "\u8D34\u8EAB\u9AD8\u9886\u5185\u886C",
    top: "\u77ED\u6B3E\u76AE\u8D28\u5939\u514B, \u62C9\u94FE\u659C\u5F00, \u8896\u53E3\u6536\u7D27",
    bottom: "\u7D27\u8EAB\u957F\u88E4, \u5927\u817F\u7ED1\u786C\u58F3\u8D27\u7BB1",
    outerwear: "\u957F\u6B3E\u98CE\u8863, \u5185\u4FA7\u7F1D\u591A\u4E2A\u9690\u85CF\u888B",
    legwear: "\u539A\u62A4\u817F",
    shoes: "\u539A\u5E95\u7CFB\u5E26\u957F\u9774",
    accessory: "\u80A9\u80CC\u786C\u58F3\u8D27\u7BB1, \u5355\u8033\u6302\u901A\u8BAF\u5668, \u624B\u6234\u534A\u6307\u624B\u5957"
  }, ["21-28", "29-38"]),
  c2("wld-cyb-female-virtual-idol", "\u865A\u62DF\u5076\u50CF", "female", ["fantasy"], ["\u5076\u50CF", "\u865A\u62DF", "\u8D5B\u535A", "\u821E\u53F0", "\u79D1\u5E7B"], "\u5168\u606F\u821E\u53F0\u4E0A\u7684\u5076\u50CF, \u670D\u88C5\u5E26\u53D1\u5149\u7ED3\u6784\u4E0E\u534A\u900F\u5C42, \u8FB9\u7F18\u5076\u5C14\u51FA\u73B0\u50CF\u7D20\u72B6\u7834\u788E\u3002", {
    inner: "\u4E00\u4F53\u5F0F\u8D34\u8EAB\u6F14\u51FA\u8863",
    top: "\u77ED\u6B3E\u6F14\u51FA\u4E0A\u8863, \u7F00\u53D1\u5149\u5BFC\u5E26, \u80A9\u90E8\u4E3A\u534A\u900F\u660E\u786C\u58F3",
    bottom: "\u5206\u5C42\u77ED\u88D9, \u5916\u5C42\u534A\u900F\u5E76\u5E26\u6D41\u52A8\u5149\u7EB9",
    outerwear: "\u60AC\u6D6E\u5F0F\u62AB\u7EB1, \u4E0D\u8D34\u8EAB, \u968F\u52A8\u4F5C\u6EDE\u540E\u98D8\u52A8",
    legwear: "\u8FC7\u819D\u957F\u889C, \u889C\u53E3\u5D4C\u53D1\u5149\u73AF",
    shoes: "\u539A\u5E95\u821E\u53F0\u9774, \u978B\u5E95\u53D1\u5149",
    accessory: "\u53CC\u9A6C\u5C3E\u672B\u7AEF\u6E10\u53D8\u4E3A\u534A\u900F\u660E, \u5934\u6234\u6F14\u51FA\u8033\u9EA6, \u8EAB\u5468\u6D6E\u52A8\u7EC6\u5C0F\u5149\u70B9"
  }, ["16-20", "21-28"]),
  c2("wld-cyb-male-cage-fighter", "\u4E49\u4F53\u683C\u6597\u5BB6", "male", ["fantasy"], ["\u683C\u6597", "\u4E49\u4F53", "\u5730\u4E0B", "\u8D5B\u535A", "\u79D1\u5E7B"], "\u5730\u4E0B\u64C2\u53F0\u7684\u683C\u6597\u624B, \u4E0A\u8EAB\u51E0\u4E4E\u4E0D\u7740\u8863\u7269, \u4E49\u4F53\u4E0E\u65E7\u4F24\u90FD\u5F53\u52CB\u7AE0\u3002", {
    inner: "\u4EC5\u7F20\u7EF7\u5E26\u4E8E\u80F8\u8179",
    top: "\u65E0\u4E0A\u8863, \u53CC\u81C2\u4E3A\u673A\u68B0\u4E49\u4F53, \u5173\u8282\u5904\u9732\u6DB2\u538B\u7ED3\u6784",
    bottom: "\u683C\u6597\u77ED\u88E4, \u8170\u675F\u5BBD\u5E26",
    outerwear: "\u51FA\u573A\u65F6\u62AB\u4E00\u4EF6\u8FDE\u5E3D\u6597\u7BF7, \u4E0A\u573A\u5373\u8131",
    legwear: "\u5C0F\u817F\u7F20\u62A4\u5E26",
    shoes: "\u8D64\u8DB3\u6216\u8584\u5E95\u8F6F\u978B",
    accessory: "\u62F3\u5957\u63A5\u53E3\u5916\u9732, \u7709\u9AA8\u4E0E\u98A7\u9AA8\u6709\u65E7\u4F24\u75D5, \u9F7F\u95F4\u54AC\u62A4\u9F7F"
  }, ["21-28", "29-38"]),
  c2("wld-cyb-female-fixer", "\u6570\u636E\u63AE\u5BA2", "female", ["fantasy", "career"], ["\u63AE\u5BA2", "\u4E2D\u95F4\u4EBA", "\u8D5B\u535A", "\u7CBE\u660E", "\u79D1\u5E7B"], "\u7A7F\u68AD\u4E8E\u4F01\u4E1A\u4E0E\u8857\u5934\u4E4B\u95F4\u7684\u4E2D\u95F4\u4EBA, \u526A\u88C1\u8BB2\u7A76\u4F46\u914D\u4EF6\u5168\u662F\u786C\u8D27\u3002", {
    inner: "\u771F\u4E1D\u8D28\u5730\u7ACB\u9886\u886C\u8863",
    top: "\u5408\u4F53\u897F\u88C5\u5916\u5957, \u80A9\u7EBF\u5229\u843D, \u5185\u886C\u5D4C\u5C4F\u853D\u5C42",
    bottom: "\u9AD8\u8170\u76F4\u7B52\u957F\u88E4, \u88E4\u7EBF\u7B14\u633A",
    outerwear: "\u957F\u6B3E\u786C\u633A\u5927\u8863, \u7ACB\u9886\u53EF\u62C9\u81F3\u4E0B\u988C",
    legwear: "\u8584\u538B\u7F29\u889C",
    shoes: "\u5C16\u5934\u7EC6\u8DDF\u77ED\u9774",
    accessory: "\u5355\u8FB9\u8033\u6302\u5F0F\u7EC8\u7AEF, \u6307\u6234\u6570\u636E\u73AF, \u624B\u63D0\u786C\u58F3\u516C\u6587\u7BB1"
  }, ["29-38", "39-50"]),
  c2("wld-cyb-male-machine-cultist", "\u673A\u68B0\u795E\u6559\u4FE1\u5F92", "male", ["fantasy"], ["\u4FE1\u5F92", "\u673A\u68B0\u795E\u6559", "\u8D5B\u535A", "\u72C2\u70ED", "\u79D1\u5E7B"], "\u628A\u6539\u9020\u5F53\u4F5C\u4FE1\u4EF0\u7684\u6559\u5F92, \u957F\u888D\u4E0B\u4F38\u51FA\u591A\u6761\u673A\u68B0\u81C2, \u9762\u90E8\u534A\u8986\u91D1\u5C5E\u3002", {
    inner: "\u8D34\u8EAB\u957F\u5185\u888D",
    top: "\u76F4\u7B52\u957F\u888D, \u524D\u895F\u7EC7\u9F7F\u8F6E\u72B6\u7EB9\u6837",
    bottom: "\u888D\u6446\u53CA\u5730, \u884C\u8D70\u65F6\u9732\u51FA\u673A\u68B0\u8DB3\u90E8",
    outerwear: "\u5E26\u515C\u5E3D\u5916\u888D, \u80CC\u540E\u4F38\u51FA\u4E24\u81F3\u56DB\u6761\u8F85\u52A9\u673A\u68B0\u81C2",
    legwear: "\u673A\u68B0\u62A4\u817F\u5916\u58F3",
    shoes: "\u673A\u68B0\u8DB3\u90E8\u7ED3\u6784, \u65E0\u978B",
    accessory: "\u9762\u90E8\u534A\u4FA7\u8986\u91D1\u5C5E\u9762\u677F, \u9888\u6302\u9F7F\u8F6E\u72B6\u5723\u5FBD, \u624B\u6301\u7EBF\u7F06\u7F20\u7ED5\u7684\u6CD5\u5668"
  }, ["39-50", "51-65"]),
  c2("wld-cyb-male-slum-teen", "\u8D2B\u6C11\u7A9F\u5C11\u5E74", "male", ["fantasy"], ["\u5C11\u5E74", "\u8D2B\u6C11\u7A9F", "\u8D5B\u535A", "\u8857\u5934", "\u79D1\u5E7B"], "\u5E95\u5C42\u8857\u533A\u957F\u5927\u7684\u5C11\u5E74, \u6361\u6765\u7684\u8863\u670D\u5C42\u5C42\u53E0\u7A7F, \u53EA\u6709\u4E00\u53EA\u4E49\u773C\u662F\u597D\u4E1C\u897F\u3002", {
    inner: "\u6D17\u65E7\u957F\u8896T\u6064, \u9886\u53E3\u6495\u5F00",
    top: "\u8FC7\u5927\u7684\u8FDE\u5E3D\u886B, \u8896\u53E3\u78E8\u7834, \u5E3D\u5B50\u5E38\u5E74\u6234\u7740",
    bottom: "\u7834\u6D1E\u5DE5\u88C5\u88E4, \u7528\u7EF3\u5F53\u8170\u5E26",
    outerwear: "\u6361\u6765\u7684\u673A\u80FD\u5916\u5957, \u5C3A\u7801\u660E\u663E\u504F\u5927, \u62C9\u94FE\u574F\u4E86\u534A\u622A",
    legwear: "\u4E0D\u6210\u5BF9\u7684\u889C\u5B50",
    shoes: "\u65E7\u8FD0\u52A8\u978B, \u978B\u5E95\u7528\u80F6\u5E26\u7F20\u4F4F",
    accessory: "\u4E00\u53EA\u4E49\u773C\u4E0E\u53E6\u4E00\u53EA\u4E0D\u540C, \u9888\u6302\u6361\u6765\u7684\u8033\u673A, \u624B\u7F20\u7EF7\u5E26"
  }, ["16-20"]),
  c2("wld-cyb-female-corp-exec", "\u4F01\u4E1A\u9AD8\u5C42", "female", ["fantasy", "career"], ["\u9AD8\u7BA1", "\u4F01\u4E1A", "\u8D5B\u535A", "\u51B7\u786C", "\u79D1\u5E7B"], "\u5DE8\u578B\u4F01\u4E1A\u7684\u9AD8\u5C42, \u6781\u7B80\u5ED3\u5F62\u52A0\u9690\u5F62\u4E49\u4F53, \u5168\u8EAB\u552F\u4E00\u7684\u88C5\u9970\u662F\u4F01\u4E1A\u5FBD\u6807\u3002", {
    inner: "\u9AD8\u9886\u8D34\u8EAB\u5185\u886C, \u65E0\u63A5\u7F1D",
    top: "\u786C\u633A\u5ED3\u5F62\u4E0A\u8863, \u80A9\u7EBF\u5448\u76F4\u89D2, \u65E0\u4EFB\u4F55\u56FE\u6848",
    bottom: "\u9AD8\u8170\u957F\u88E4, \u88E4\u7EBF\u950B\u5229",
    outerwear: "\u53CA\u8E1D\u957F\u5916\u5957, \u7ACB\u9886\u53EF\u5168\u5408\u4E0A\u906E\u4F4F\u4E0B\u534A\u5F20\u8138",
    legwear: "\u8584\u538B\u7F29\u957F\u889C",
    shoes: "\u65B9\u5934\u539A\u5E95\u77ED\u9774",
    accessory: "\u9886\u53E3\u4E00\u679A\u4F01\u4E1A\u5FBD\u6807, \u8033\u540E\u5D4C\u9690\u5F62\u63A5\u53E3, \u6307\u7AEF\u6709\u7EC6\u5FAE\u91D1\u5C5E\u53CD\u5149"
  }, ["29-38", "39-50"]),
  // ================= 硬科幻(fantasy: 星际 / 机甲 / 殖民) =================
  c2("wld-sci-male-captain", "\u661F\u8230\u8230\u957F", "male", ["fantasy", "career"], ["\u8230\u957F", "\u661F\u8230", "\u519B\u5B98", "\u79D1\u5E7B", "\u5A01\u4E25"], "\u661F\u8230\u7684\u6700\u9AD8\u6307\u6325, \u5236\u670D\u7B14\u633A\u3001\u80A9\u7AE0\u4E0E\u5FBD\u8BB0\u9F50\u5168, \u7AD9\u59FF\u6C38\u8FDC\u7AEF\u7740\u3002", {
    inner: "\u9AD8\u9886\u5236\u5F0F\u5185\u886C, \u9886\u53E3\u6709\u4E00\u9053\u7EC6\u538B\u7EBF",
    top: "\u53CC\u6392\u6263\u5236\u670D\u4E0A\u8863, \u7ACB\u9886, \u80A9\u7F00\u9636\u7EA7\u7AE0, \u80F8\u524D\u4E00\u6392\u52CB\u6807",
    bottom: "\u5236\u5F0F\u957F\u88E4, \u4FA7\u7F1D\u6709\u4E00\u9053\u7EC7\u5E26",
    outerwear: "\u53CA\u819D\u8230\u957F\u5916\u5957, \u80A9\u7EBF\u5BBD\u5E73, \u540E\u5F00\u8869",
    legwear: "\u5236\u5F0F\u957F\u889C",
    shoes: "\u9AD8\u5E2E\u5236\u5F0F\u9774, \u9774\u9762\u65E0\u8936",
    accessory: "\u8155\u6234\u6307\u6325\u7EC8\u7AEF, \u80F8\u53E3\u522B\u8230\u5FBD, \u8170\u675F\u5236\u5F0F\u5E26"
  }, ["39-50", "51-65"]),
  c2("wld-sci-female-officer", "\u8230\u961F\u519B\u5B98", "female", ["fantasy", "career"], ["\u519B\u5B98", "\u8230\u961F", "\u5236\u670D", "\u79D1\u5E7B", "\u5E72\u7EC3"], "\u8230\u6865\u503C\u52E4\u7684\u5973\u519B\u5B98, \u5236\u670D\u5408\u4F53\u3001\u53D1\u9AFB\u4E00\u4E1D\u4E0D\u82DF, \u7EC8\u7AEF\u4E0D\u79BB\u8155\u3002", {
    inner: "\u9AD8\u9886\u8D34\u8EAB\u5185\u886C",
    top: "\u5408\u4F53\u5236\u670D\u4E0A\u8863, \u7ACB\u9886, \u80A9\u7F00\u9636\u7EA7\u7AE0, \u8170\u8EAB\u6536\u675F",
    bottom: "\u5236\u5F0F\u76F4\u7B52\u957F\u88E4",
    outerwear: "\u77ED\u6B3E\u5236\u5F0F\u5916\u5957, \u503C\u8231\u5916\u4EFB\u52A1\u65F6\u52A0\u7A7F",
    legwear: "\u538B\u7F29\u957F\u889C",
    shoes: "\u4E2D\u7B52\u5236\u5F0F\u9774",
    accessory: "\u4F4E\u53D1\u9AFB\u6536\u8FDB\u5236\u5F0F\u53D1\u7F51, \u8155\u6234\u6570\u636E\u7EC8\u7AEF, \u80F8\u524D\u522B\u8BC6\u522B\u724C"
  }, ["21-28", "29-38"]),
  c2("wld-sci-male-engineer", "\u8F6E\u673A\u5DE5\u7A0B\u5E08", "male", ["fantasy", "career"], ["\u5DE5\u7A0B\u5E08", "\u8F6E\u673A", "\u661F\u8230", "\u79D1\u5E7B", "\u5B9E\u5E72"], "\u5B88\u7740\u52A8\u529B\u8231\u7684\u5DE5\u7A0B\u5E08, \u8FDE\u4F53\u5DE5\u88C5\u6EE1\u662F\u6CB9\u6C61, \u5DE5\u5177\u5E26\u6BD4\u8170\u8FD8\u5BBD\u3002", {
    inner: "\u77ED\u8896\u529F\u80FD\u5185\u886C",
    top: "\u8FDE\u4F53\u5DE5\u88C5\u4E0A\u8EAB, \u8896\u5B50\u7CFB\u5728\u8170\u95F4, \u80F8\u524D\u4E00\u6392\u5DE5\u5177\u888B",
    bottom: "\u8FDE\u4F53\u5DE5\u88C5\u4E0B\u8EAB, \u819D\u90E8\u53CC\u5C42\u52A0\u539A",
    outerwear: "\u53CD\u5149\u6761\u5DE5\u4F5C\u80CC\u5FC3",
    legwear: "\u539A\u5DE5\u88C5\u889C",
    shoes: "\u94A2\u5934\u9632\u6ED1\u5DE5\u9774, \u978B\u9762\u5168\u662F\u5212\u75D5",
    accessory: "\u8170\u675F\u5BBD\u5DE5\u5177\u5E26, \u8033\u6234\u5355\u8FB9\u901A\u8BAF\u5668, \u62A4\u76EE\u955C\u63A8\u5728\u989D\u9876(\u975E\u5FC5\u8981\u65F6\u7701\u7565)"
  }, ["29-38", "39-50"]),
  c2("wld-sci-male-marine", "\u5916\u9AA8\u9ABC\u9646\u6218\u961F", "male", ["fantasy"], ["\u9646\u6218\u961F", "\u5916\u9AA8\u9ABC", "\u519B\u4EBA", "\u79D1\u5E7B", "\u786C\u6D3E"], "\u7A7F\u52A8\u529B\u5916\u9AA8\u9ABC\u7684\u9646\u6218\u961F\u5458, \u88C5\u7532\u5206\u7247\u5305\u8986, \u5173\u8282\u5904\u9732\u51FA\u6DB2\u538B\u7ED3\u6784\u3002", {
    inner: "\u8D34\u8EAB\u4F5C\u6218\u5185\u886C, \u5E26\u6563\u70ED\u7F51\u683C",
    top: "\u5206\u7247\u5F0F\u88C5\u7532\u4E0A\u8EAB, \u80F8\u53E3\u538B\u90E8\u961F\u7F16\u53F7, \u80A9\u7532\u5448\u539A\u5F27",
    bottom: "\u88C5\u7532\u62A4\u817F, \u5927\u817F\u5916\u4FA7\u6302\u5F39\u5323\u4ED3",
    outerwear: "\u80CC\u8D1F\u52A8\u529B\u5305, \u6CBF\u810A\u67F1\u5EF6\u4F38\u51FA\u652F\u6491\u81C2",
    legwear: "\u6DB2\u538B\u62A4\u80EB",
    shoes: "\u539A\u91CD\u88C5\u7532\u9774, \u8DB3\u5E95\u5E26\u7F13\u51B2\u7ED3\u6784",
    accessory: "\u5168\u8986\u5934\u76D4\u5E26\u5355\u6761\u89C6\u7A97, \u80A9\u6302\u6218\u672F\u706F, \u81C2\u7F1A\u63A7\u5236\u9762\u677F"
  }, ["21-28", "29-38"]),
  c2("wld-sci-male-space-miner", "\u592A\u7A7A\u77FF\u5DE5", "male", ["fantasy", "rural"], ["\u77FF\u5DE5", "\u592A\u7A7A", "\u52B3\u5DE5", "\u79D1\u5E7B", "\u7C97\u7C9D"], "\u5728\u5C0F\u884C\u661F\u5E26\u5E72\u6D3B\u7684\u77FF\u5DE5, \u88C5\u5907\u65E7\u4E14\u8865\u4E01\u591A, \u5BC6\u5C01\u5708\u4E0A\u5168\u662F\u5212\u75D5\u3002", {
    inner: "\u539A\u7EC7\u4FDD\u6E29\u5185\u886C",
    top: "\u52A0\u539A\u5DE5\u4F5C\u670D\u4E0A\u8EAB, \u591A\u5904\u7528\u80F6\u5E26\u8865\u8FC7, \u80F8\u524D\u6709\u7F16\u53F7\u5E03\u8D34",
    bottom: "\u540C\u6B3E\u5DE5\u4F5C\u88E4, \u819D\u90E8\u78E8\u5230\u53D1\u4EAE",
    outerwear: "\u7B80\u6613\u8231\u5916\u670D\u4E0A\u534A\u8EAB, \u5934\u76D4\u6302\u5728\u8170\u6263\u4E0A",
    legwear: "\u539A\u4FDD\u6E29\u889C",
    shoes: "\u78C1\u5438\u91CD\u9774, \u978B\u5E95\u5E26\u5438\u9644\u7ED3\u6784",
    accessory: "\u8170\u6302\u6C14\u74F6\u4E0E\u7167\u660E\u706F, \u624B\u5957\u6307\u8282\u5904\u78E8\u7834"
  }, ["29-38", "39-50"]),
  c2("wld-sci-female-planetary-scientist", "\u884C\u661F\u79D1\u8003\u5458", "female", ["fantasy", "career"], ["\u79D1\u8003", "\u7814\u7A76\u5458", "\u884C\u661F", "\u79D1\u5E7B", "\u4E13\u6CE8"], "\u5728\u964C\u751F\u661F\u7403\u505A\u5730\u8868\u79D1\u8003\u7684\u7814\u7A76\u5458, \u4E00\u8EAB\u9632\u62A4\u670D\u52A0\u91C7\u6837\u5305\u3002", {
    inner: "\u8D34\u8EAB\u6E29\u63A7\u5185\u886C",
    top: "\u9632\u62A4\u670D\u4E0A\u8EAB, \u62C9\u94FE\u81EA\u80F8\u53E3\u659C\u5F00, \u8896\u53E3\u5E26\u5BC6\u5C01\u73AF",
    bottom: "\u9632\u62A4\u670D\u957F\u88E4, \u819D\u90E8\u4E0E\u81C0\u90E8\u52A0\u539A",
    outerwear: "\u53EF\u62C6\u5378\u9632\u5C18\u7F69\u888D, \u91C7\u6837\u65F6\u7A7F\u8131",
    legwear: "\u6E29\u63A7\u957F\u889C",
    shoes: "\u539A\u5E95\u9632\u62A4\u9774, \u978B\u5E95\u7EB9\u8DEF\u6781\u6DF1",
    accessory: "\u5934\u76D4\u5939\u5728\u81C2\u5F2F, \u80A9\u6302\u91C7\u6837\u7BB1, \u8155\u6234\u73AF\u5883\u8BFB\u6570\u5668"
  }, ["29-38", "39-50"]),
  c2("wld-sci-female-bio-researcher", "\u751F\u5316\u7814\u7A76\u5458", "female", ["fantasy", "career"], ["\u7814\u7A76\u5458", "\u751F\u5316", "\u5B9E\u9A8C\u5BA4", "\u79D1\u5E7B", "\u51B7\u9759"], "\u5B9E\u9A8C\u5BA4\u91CC\u7684\u751F\u5316\u7814\u7A76\u5458, \u65E0\u83CC\u670D\u5C42\u5C42\u5C01\u95ED, \u53EA\u9732\u4E00\u53CC\u773C\u775B\u3002", {
    inner: "\u8D34\u8EAB\u65E0\u83CC\u5185\u886C",
    top: "\u8FDE\u4F53\u65E0\u83CC\u670D\u4E0A\u8EAB, \u9886\u53E3\u4E0E\u8896\u53E3\u5E26\u5BC6\u5C01\u6761",
    bottom: "\u8FDE\u4F53\u65E0\u83CC\u670D\u4E0B\u8EAB, \u4E0E\u978B\u5957\u4E00\u4F53",
    outerwear: "\u5916\u7F69\u9694\u79BB\u888D, \u80CC\u540E\u7CFB\u5E26",
    legwear: "\u4E00\u4F53\u5F0F\u978B\u5957",
    shoes: "\u5B9E\u9A8C\u5BA4\u4E13\u7528\u8F6F\u5E95\u978B, \u5305\u5728\u978B\u5957\u5185",
    accessory: "\u5168\u7F69\u62A4\u76EE\u9762\u5C4F, \u53CC\u5C42\u624B\u5957, \u80F8\u524D\u522B\u8F90\u5C04\u5242\u91CF\u724C"
  }, ["21-28", "29-38"]),
  c2("wld-sci-male-mecha-pilot", "\u673A\u7532\u9A7E\u9A76\u5458", "male", ["fantasy"], ["\u673A\u7532", "\u9A7E\u9A76\u5458", "\u519B\u4EBA", "\u79D1\u5E7B", "\u9510\u6C14"], "\u9A7E\u9A76\u5927\u578B\u673A\u7532\u7684\u98DE\u884C\u5458, \u9A7E\u9A76\u670D\u8D34\u8EAB\u5E26\u63A5\u53E3, \u5934\u76D4\u4ECE\u4E0D\u79BB\u624B\u3002", {
    inner: "\u4E00\u4F53\u5F0F\u9A7E\u9A76\u7D27\u8EAB\u8863, \u6CBF\u808C\u8089\u8D70\u5411\u538B\u51FA\u5206\u533A\u7EBF",
    top: "\u786C\u58F3\u62A4\u80F8, \u4E2D\u592E\u4E3A\u795E\u7ECF\u63A5\u9A73\u53E3",
    bottom: "\u9A7E\u9A76\u670D\u4E0B\u8EAB, \u5927\u817F\u5904\u6709\u56FA\u5B9A\u6263\u5E26",
    outerwear: "\u51FA\u8231\u65F6\u5957\u4E00\u4EF6\u77ED\u5939\u514B, \u80CC\u5370\u673A\u4F53\u7F16\u53F7",
    legwear: "\u4E00\u4F53\u5316\u62A4\u817F",
    shoes: "\u78C1\u5438\u9A7E\u9A76\u9774",
    accessory: "\u5934\u76D4\u5939\u5728\u814B\u4E0B, \u540E\u9888\u6709\u63A5\u9A73\u63D2\u53E3, \u8155\u6234\u673A\u4F53\u72B6\u6001\u8868"
  }, ["21-28", "29-38"]),
  c2("wld-sci-female-mecha-pilot", "\u5973\u673A\u7532\u9A7E\u9A76\u5458", "female", ["fantasy"], ["\u673A\u7532", "\u9A7E\u9A76\u5458", "\u5C11\u5973", "\u79D1\u5E7B", "\u679C\u51B3"], "\u5E74\u8F7B\u7684\u5973\u6027\u673A\u7532\u9A7E\u9A76\u5458, \u7D27\u8EAB\u9A7E\u9A76\u670D\u52A0\u62A4\u5177, \u957F\u53D1\u5168\u90E8\u675F\u8FDB\u5934\u7F69\u3002", {
    inner: "\u4E00\u4F53\u5F0F\u9A7E\u9A76\u7D27\u8EAB\u8863, \u9886\u53E3\u81F3\u4E0B\u988C",
    top: "\u8F7B\u91CF\u62A4\u80F8\u58F3, \u4FA7\u9762\u7559\u6563\u70ED\u5F00\u53E3",
    bottom: "\u9A7E\u9A76\u670D\u4E0B\u8EAB, \u819D\u90E8\u5D4C\u7F13\u51B2\u57AB",
    outerwear: "\u77ED\u6B3E\u98DE\u884C\u5939\u514B, \u9886\u53E3\u4E00\u5708\u7ED2\u6BDB",
    legwear: "\u4E00\u4F53\u5316\u62A4\u817F",
    shoes: "\u539A\u5E95\u78C1\u5438\u9774",
    accessory: "\u957F\u53D1\u675F\u8FDB\u5F39\u6027\u5934\u7F69, \u624B\u6301\u5168\u7F69\u5934\u76D4, \u8155\u5E26\u751F\u547D\u4F53\u5F81\u73AF"
  }, ["16-20", "21-28"]),
  c2("wld-sci-female-android", "\u4EFF\u751F\u4EBA", "female", ["fantasy"], ["\u4EFF\u751F\u4EBA", "\u673A\u68B0", "\u975E\u4EBA", "\u79D1\u5E7B", "\u7A7A\u7075"], "\u5916\u5F62\u8FD1\u4EBA\u7684\u4EFF\u751F\u4F53, \u5173\u8282\u5904\u80FD\u770B\u5230\u5206\u4EF6\u7F1D\u9699, \u8863\u7269\u8D34\u5408\u5230\u50CF\u7B2C\u4E8C\u5C42\u76AE\u80A4\u3002", {
    inner: "\u4E00\u4F53\u6210\u578B\u8D34\u8EAB\u5916\u58F3, \u65E0\u63A5\u7F1D",
    top: "\u5408\u6210\u6750\u8D28\u4E0A\u8863, \u6CBF\u5173\u8282\u5904\u7559\u51FA\u5206\u4EF6\u7F1D\u9699",
    bottom: "\u540C\u6599\u957F\u88E4, \u819D\u4E0E\u8E1D\u5173\u8282\u5904\u9732\u51FA\u7ED3\u6784\u73AF",
    outerwear: "\u534A\u900F\u8584\u8D28\u5916\u7F69, \u9759\u7535\u5438\u9644\u5728\u8EAB\u4E0A\u800C\u975E\u62AB\u6302",
    legwear: "\u4E0E\u5916\u58F3\u4E00\u4F53",
    shoes: "\u4E0E\u8DB3\u90E8\u7ED3\u6784\u4E00\u4F53, \u65E0\u72EC\u7ACB\u978B",
    accessory: "\u540E\u9888\u6709\u578B\u53F7\u94ED\u724C, \u77B3\u5B54\u4E2D\u6709\u7EC6\u5C0F\u73AF\u72B6\u7ED3\u6784, \u6307\u5C16\u6709\u63A5\u53E3\u89E6\u70B9"
  }, ["21-28", "29-38"])
];

// services/characterStylingWardrobeCapsulesGlamour.ts
var slot5 = (detail, material) => ({
  label: detail.replace(/[，,].*$/, ""),
  material: material || detail,
  detail
});
var c3 = (id, label, gender, eras, roleTags, summary, slots3, ageBands) => ({
  id,
  label,
  gender,
  eras,
  roleTags,
  summary,
  ageBands,
  slots: Object.fromEntries(
    Object.entries(slots3).map(([key, detail]) => [key, slot5(detail)])
  )
});
var ADULT = ["21-28", "29-38"];
var ADULT_WIDE = ["21-28", "29-38", "39-50"];
var GLAMOUR_WARDROBE_CAPSULES = [
  // ================= 现代都市(modern / career) =================
  c3("glm-mod-female-sheer-satin-qipao", "\u534A\u900F\u7F0E\u9762\u7EE3\u82B1\u65D7\u888D", "female", ["modern", "career"], ["\u540D\u5A9B", "\u5973\u4E3B", "\u4EA4\u9645\u82B1", "\u65D7\u888D", "\u9B45\u529B"], "\u534A\u900F\u7F0E\u9762\u65D7\u888D, \u7ACB\u9886\u6302\u8116\u5F0F\u80A9\u7EBF, \u5927\u9762\u79EF\u7EE3\u82B1\u4E0E\u9AD8\u5F00\u8869, \u6750\u8D28\u6C34\u5149\u611F\u5F3A\u3002", {
    inner: "\u540C\u6599\u886C\u88D9\u77ED\u6253\u5E95, \u957F\u5EA6\u5230\u5927\u817F\u4E2D\u6BB5, \u8FB9\u7F18\u505A\u65E0\u75D5\u5904\u7406\u4E0D\u5916\u9732",
    top: "\u534A\u900F\u7F0E\u9762\u65D7\u888D\u4E0A\u8EAB, \u7ACB\u9886\u914D\u4E00\u5B57\u76D8\u6263, \u80A9\u90E8\u6302\u8116\u5F0F\u6536\u7A84\u9732\u51FA\u9501\u9AA8\u4E0E\u80A9\u7EBF, \u80F8\u7EBF\u7531\u7ACB\u4F53\u7701\u9053\u6258\u8D77, \u8170\u4FA7\u6536\u51FA\u660E\u663E\u8170\u7EBF",
    bottom: "\u65D7\u888D\u4E0B\u6446\u8D34\u5408\u8170\u81C0\u66F2\u7EBF\u81EA\u7136\u6536\u62E2, \u5355\u4FA7\u5F00\u8869\u5230\u5927\u817F\u4E0A\u6BB5, \u5F00\u8869\u8FB9\u538B\u7EC6\u6EDA\u8FB9",
    outerwear: "\u540C\u6599\u77ED\u62AB\u80A9\u8584\u7EB1, \u53EA\u642D\u5728\u81C2\u5F2F\u4E0D\u906E\u4F4F\u4E0A\u8EAB\u7EBF\u6761",
    legwear: "\u8584\u900F\u957F\u7B52\u4E1D\u889C, \u7EC7\u5EA6\u7EC6\u817B\u5E26\u8F7B\u5FAE\u5149\u6CFD",
    shoes: "\u7EC6\u9AD8\u8DDF\u5C16\u5934\u978B, \u978B\u9762\u7F0E\u6599\u540C\u6CFD, \u978B\u8DDF\u7EA4\u7EC6",
    accessory: "\u7EC6\u94FE\u8033\u5760\u4E0E\u4E00\u679A\u7EC6\u8155\u956F, \u82B1\u5349\u4E0E\u8774\u8776\u523A\u7EE3\u4ECE\u4E0B\u6446\u76D8\u65CB\u800C\u4E0A\u6536\u5728\u8170\u4FA7"
  }, ADULT_WIDE),
  c3("glm-mod-female-embroidery-slit-cheongsam", "\u6539\u826F\u523A\u7EE3\u5F00\u8869\u65D7\u888D\u88D9", "female", ["modern", "career"], ["\u540D\u5A9B", "\u5973\u914D", "\u5BB4\u4F1A", "\u65D7\u888D", "\u9B45\u529B"], "\u6539\u826F\u65E0\u8896\u65D7\u888D\u88D9, \u7F51\u7EB1\u62FC\u63A5\u4E0E\u91CD\u5DE5\u523A\u7EE3, \u8D70\u52A8\u65F6\u5F00\u8869\u5E26\u51FA\u817F\u90E8\u7EBF\u6761\u3002", {
    inner: "\u8D34\u8EAB\u65E0\u75D5\u5185\u8863\u4E0E\u77ED\u886C\u88D9, \u4FDD\u8BC1\u5916\u5C42\u7EBF\u6761\u5E72\u51C0",
    top: "\u65E0\u8896\u7ACB\u9886\u65D7\u888D\u4E0A\u8EAB, \u9886\u53E3\u4E0E\u80A9\u7A9D\u5904\u7528\u7F51\u7EB1\u62FC\u63A5\u505A\u51FA\u82E5\u9690\u82E5\u73B0\u7684\u5206\u5C42, \u80F8\u8170\u4E4B\u95F4\u4EE5\u66F2\u7EBF\u526A\u88C1\u8D34\u5408",
    bottom: "\u5305\u8EAB\u957F\u88D9\u6446, \u524D\u8EAB\u6536\u62E2\u540E\u8EAB\u7559\u6D3B\u8936, \u4FA7\u5F00\u8869\u9AD8\u81F3\u5927\u817F, \u5F00\u8869\u5185\u5C42\u538B\u523A\u7EE3\u8D34\u8FB9",
    outerwear: "\u65E0\u5916\u5957, \u6216\u4E34\u65F6\u642D\u4E00\u6761\u957F\u4E1D\u5DFE\u5728\u8098\u95F4",
    legwear: "\u7EC6\u7F51\u773C\u957F\u889C, \u889C\u53E3\u5E73\u6574\u4E0D\u52D2\u75D5",
    shoes: "\u7EC6\u5E26\u9AD8\u8DDF\u51C9\u978B, \u811A\u8E1D\u4E00\u5708\u7EC6\u6263\u5E26",
    accessory: "\u7F20\u679D\u82B1\u523A\u7EE3\u6CBF\u88D9\u4FA7\u5411\u4E0A\u5EF6\u5C55, \u8033\u7EBF\u4E0E\u9888\u94FE\u7EC6\u5982\u53D1\u4E1D"
  }, ADULT_WIDE),
  c3("glm-mod-female-bias-satin-slip", "\u659C\u88C1\u7F0E\u9762\u540A\u5E26\u957F\u88D9", "female", ["modern"], ["\u540D\u5A9B", "\u90FD\u5E02", "\u665A\u5BB4", "\u9B45\u529B", "\u5973\u4E3B"], "\u659C\u88C1\u7F0E\u9762\u540A\u5E26\u957F\u88D9, \u5E03\u6599\u8D34\u7740\u8EAB\u5F62\u6D41\u4E0B\u6765, \u5149\u6CFD\u968F\u52A8\u4F5C\u53D8\u5316\u3002", {
    inner: "\u65E0\u75D5\u8D34\u8EAB\u5185\u8863, \u80A9\u5E26\u6781\u7EC6\u4E0D\u9732\u75D5\u8FF9",
    top: "\u7EC6\u540A\u5E26\u7F0E\u9762\u4E0A\u8EAB, \u659C\u88C1\u4F7F\u5E03\u6599\u987A\u7740\u80F8\u8170\u66F2\u7EBF\u81EA\u7136\u8D34\u5408, \u9886\u53E3\u505A\u4F4E\u5F27\u7EBF\u9732\u51FA\u9501\u9AA8\u4E0E\u80A9\u80DB",
    bottom: "\u540C\u7247\u659C\u88C1\u957F\u88D9\u6446\u5782\u81F3\u811A\u8E1D, \u8170\u81C0\u5904\u8D34\u5408\u800C\u4E0B\u6446\u6563\u5F00, \u540E\u8EAB\u5F00\u4E00\u9053\u4F4E\u8869",
    outerwear: "\u8584\u9488\u7EC7\u5F00\u886B\u968F\u624B\u6302\u5728\u80A9\u4E0A, \u53EA\u4F5C\u53CD\u5DEE\u4E0D\u6536\u8170",
    legwear: "\u5149\u817F\u6216\u6781\u8584\u8FD1\u80A4\u957F\u889C",
    shoes: "\u7EC6\u8DDF\u7A46\u52D2\u978B, \u978B\u9762\u5355\u6761\u7F0E\u5E26",
    accessory: "\u7F0E\u9762\u5728\u706F\u4E0B\u5448\u6D41\u52A8\u6C34\u5149, \u914D\u4E00\u679A\u957F\u5760\u8033\u73AF"
  }, ADULT),
  c3("glm-mod-female-lace-bodycon", "\u857E\u4E1D\u8D34\u8EAB\u8FDE\u8863\u88D9", "female", ["modern", "career"], ["\u5973\u53CD", "\u5FA1\u59D0", "\u90FD\u5E02", "\u9B45\u529B", "\u5973\u914D"], "\u901A\u8EAB\u857E\u4E1D\u8D34\u8EAB\u88D9, \u82B1\u7EB9\u9542\u7A7A\u5904\u900F\u51FA\u5185\u886C\u5C42\u6B21, \u5ED3\u5F62\u5E72\u51C0\u5229\u843D\u3002", {
    inner: "\u540C\u8272\u7CFB\u8D34\u8EAB\u886C\u88D9, \u957F\u5EA6\u7565\u77ED\u4E8E\u5916\u5C42\u8BA9\u857E\u4E1D\u4E0B\u6446\u900F\u51FA\u82B1\u7EB9",
    top: "\u957F\u8896\u857E\u4E1D\u4E0A\u8EAB, \u9AD8\u9886\u53E3\u6536\u4F4F\u8116\u9888, \u80A9\u80CC\u5904\u4FDD\u7559\u5927\u9762\u79EF\u9542\u7A7A\u82B1\u7EB9, \u80F8\u8170\u4EE5\u7ACB\u4F53\u88C1\u7247\u8D34\u5408",
    bottom: "\u5305\u8EAB\u53CA\u819D\u88D9\u6446, \u8170\u81C0\u7EBF\u6761\u5B8C\u6574, \u540E\u5F00\u4E00\u9053\u77ED\u8869\u4FBF\u4E8E\u884C\u8D70",
    outerwear: "\u786C\u633A\u8584\u5462\u77ED\u5916\u5957, \u80A9\u7EBF\u5229\u843D\u4E0E\u857E\u4E1D\u5F62\u6210\u8F6F\u786C\u5BF9\u6BD4",
    legwear: "\u7EC6\u5BC6\u7EC7\u7EB9\u957F\u889C, \u54D1\u5149\u4E0D\u53CD\u5149",
    shoes: "\u5C16\u5934\u7EC6\u8DDF\u9AD8\u8DDF\u978B, \u978B\u9762\u7D20\u51C0",
    accessory: "\u857E\u4E1D\u82B1\u7EB9\u4EE5\u7F20\u679D\u4E0E\u5C0F\u82B1\u4E3A\u4E3B, \u8033\u9970\u4E0E\u6212\u6307\u8D70\u6781\u7B80\u7EBF\u6761"
  }, ADULT_WIDE),
  c3("glm-mod-female-velvet-wrap-gown", "\u4E1D\u7ED2\u88F9\u8EAB\u665A\u5BB4\u957F\u88D9", "female", ["modern", "career"], ["\u5973\u603B\u88C1", "\u5973\u53CD", "\u665A\u5BB4", "\u5FA1\u59D0", "\u9B45\u529B"], "\u4E1D\u7ED2\u88F9\u8EAB\u957F\u88D9, \u4EA4\u53E0\u9886\u53E3\u4E0E\u675F\u8170\u7CFB\u5E26, \u6750\u8D28\u539A\u91CD\u5438\u5149\u6709\u5206\u91CF\u3002", {
    inner: "\u8D34\u8EAB\u5E73\u53E3\u5185\u5C42, \u627F\u6258\u80F8\u7EBF\u4E0D\u5916\u9732",
    top: "\u4E1D\u7ED2\u4EA4\u53E0\u5F0F\u4E0A\u8EAB, \u9886\u53E3\u659C\u5411\u4EA4\u53C9\u9732\u51FA\u9501\u9AA8\u4E0E\u4E00\u4FA7\u80A9\u5934, \u8896\u53E3\u6536\u7A84",
    bottom: "\u540C\u6599\u957F\u88D9\u6446\u81EA\u8170\u95F4\u7CFB\u5E26\u5904\u6563\u5F00, \u4E00\u4FA7\u5F00\u8869\u5230\u819D\u4E0A, \u8D70\u52A8\u65F6\u9732\u51FA\u5C0F\u817F\u7EBF\u6761",
    outerwear: "\u540C\u6599\u957F\u5916\u888D\u968F\u610F\u62AB\u7740, \u9886\u53E3\u7FFB\u6298\u9732\u51FA\u5185\u91CC\u7F0E\u9762",
    legwear: "\u4E2D\u539A\u957F\u889C, \u54D1\u5149\u8D28\u5730\u538B\u4F4F\u4E1D\u7ED2\u7684\u5149",
    shoes: "\u7C97\u8DDF\u65B9\u5934\u9AD8\u8DDF\u978B, \u978B\u9762\u4E1D\u7ED2\u540C\u6599",
    accessory: "\u8170\u95F4\u7CFB\u5E26\u6253\u7ED3\u5782\u4E0B\u4E24\u6BB5, \u8033\u9970\u7528\u4E00\u5BF9\u539A\u91CD\u51E0\u4F55\u91D1\u5C5E\u7247"
  }, ADULT_WIDE),
  c3("glm-mod-female-sheer-blouse-suit", "\u900F\u89C6\u886C\u886B\u897F\u88C5\u5957\u88C5", "female", ["career", "modern"], ["\u5973\u603B\u88C1", "\u5F8B\u5E08", "\u804C\u573A", "\u5FA1\u59D0", "\u9B45\u529B"], "\u900F\u89C6\u886C\u886B\u914D\u9AD8\u8170\u897F\u88C5, \u804C\u573A\u9AA8\u67B6\u91CC\u85CF\u4E00\u5C42\u6750\u8D28\u5FC3\u673A\u3002", {
    inner: "\u8D34\u8EAB\u62B9\u80F8\u5185\u642D, \u4E0A\u7F18\u505A\u76F4\u7EBF\u526A\u88C1\u53EA\u5230\u80F8\u7EBF\u4E0A\u65B9",
    top: "\u8584\u900F\u96EA\u7EBA\u886C\u886B, \u9886\u53E3\u5F00\u5230\u7B2C\u4E09\u9897\u6263, \u8896\u5B50\u84EC\u677E\u8896\u53E3\u6536\u7D27, \u4E0B\u6446\u6396\u8FDB\u88E4\u8170\u52FE\u51FA\u8170\u7EBF",
    bottom: "\u9AD8\u8170\u76F4\u7B52\u897F\u88C5\u88E4, \u8170\u5934\u8D34\u5408\u80EF\u7EBF, \u88E4\u7BA1\u987A\u7740\u817F\u578B\u5782\u4E0B",
    outerwear: "\u6536\u8170\u5355\u6392\u6263\u897F\u88C5\u5916\u5957, \u80A9\u7EBF\u5229\u843D, \u8170\u90E8\u6536\u7701\u660E\u663E",
    legwear: "\u8584\u889C\u9690\u4E8E\u88E4\u811A\u4E0D\u5916\u9732",
    shoes: "\u7EC6\u8DDF\u5C16\u5934\u8239\u978B, \u978B\u9762\u6F06\u76AE\u53CD\u5149",
    accessory: "\u7EC6\u8170\u5E26\u6263\u4F4F\u5916\u5957\u8170\u7EBF, \u624B\u8155\u4E00\u5757\u65B9\u5F62\u8868"
  }, ADULT_WIDE),
  c3("glm-mod-female-halter-beaded-gown", "\u6302\u8116\u9489\u73E0\u793C\u670D\u957F\u88D9", "female", ["modern"], ["\u5973\u660E\u661F", "\u7EA2\u6BEF", "\u5BB4\u4F1A", "\u9B45\u529B", "\u5973\u4E3B"], "\u6302\u8116\u9489\u73E0\u793C\u670D, \u540E\u80CC\u5927\u9762\u79EF\u7559\u7A7A, \u73E0\u7247\u968F\u706F\u5149\u788E\u95EA\u3002", {
    inner: "\u5185\u7F6E\u80F8\u6258\u7ED3\u6784\u968F\u88D9\u8EAB\u7F1D\u5236, \u4E0D\u53E6\u7A7F\u5185\u8863",
    top: "\u6302\u8116\u5F0F\u4E0A\u8EAB, \u9888\u540E\u7CFB\u4E00\u9053\u7EC6\u5E26, \u524D\u8EAB\u9489\u73E0\u5BC6\u96C6\u6536\u5728\u80F8\u8170\u4E4B\u95F4, \u540E\u80CC\u6574\u7247\u655E\u5F00\u53EA\u7559\u4E24\u9053\u4EA4\u53C9\u7EC6\u5E26",
    bottom: "\u9C7C\u5C3E\u957F\u88D9\u6446, \u8170\u81C0\u5904\u8D34\u5408\u5230\u819D, \u819D\u4E0B\u6563\u5F00\u6210\u5927\u6446",
    outerwear: "\u65E0\u5916\u5957, \u53EA\u5728\u573A\u5916\u4E34\u65F6\u62AB\u4E00\u6761\u957F\u7ED2\u62AB\u80A9",
    legwear: "\u65E0, \u88D9\u6446\u53CA\u5730",
    shoes: "\u9AD8\u8DDF\u51C9\u978B, \u978B\u8DDF\u5185\u5D4C\u788E\u94BB",
    accessory: "\u9489\u73E0\u81EA\u80F8\u53E3\u5411\u8170\u4FA7\u6E10\u758F, \u914D\u4E00\u5BF9\u957F\u5782\u5760\u8033\u73AF"
  }, ADULT),
  c3("glm-mod-female-satin-shirt-pencil", "\u7F0E\u9762\u886C\u886B\u5305\u81C0\u88D9", "female", ["career", "modern"], ["\u79D8\u4E66", "\u52A9\u7406", "\u804C\u573A", "\u8F7B\u5962", "\u9B45\u529B"], "\u7F0E\u9762\u886C\u886B\u914D\u5305\u81C0\u88D9, \u529E\u516C\u5BA4\u91CC\u514B\u5236\u4F46\u6709\u6750\u8D28\u5149\u6CFD\u3002", {
    inner: "\u65E0\u75D5\u8D34\u8EAB\u5185\u8863, \u80A9\u5E26\u9690\u5F62",
    top: "\u7F0E\u9762\u957F\u8896\u886C\u886B, \u9886\u53E3\u655E\u5F00\u4E24\u9897, \u5E03\u6599\u5782\u5760\u8D34\u7740\u80F8\u8170\u8D77\u4F0F, \u4E0B\u6446\u6396\u8FDB\u88D9\u8170",
    bottom: "\u9AD8\u8170\u5305\u81C0\u94C5\u7B14\u88D9, \u957F\u5EA6\u5230\u819D\u4E0A, \u540E\u4E2D\u5F00\u4E00\u9053\u77ED\u8869",
    outerwear: "\u8584\u5462\u77ED\u5916\u5957\u6302\u5728\u6905\u80CC\u6216\u642D\u5728\u81C2\u5F2F",
    legwear: "\u8584\u957F\u889C, \u5149\u6CFD\u514B\u5236",
    shoes: "\u4E2D\u7EC6\u8DDF\u5C16\u5934\u978B",
    accessory: "\u7EC6\u76AE\u8170\u5E26\u52FE\u4F4F\u8170\u7EBF, \u73E0\u5149\u8033\u9489"
  }, ADULT_WIDE),
  c3("glm-mod-female-fine-knit-maxi", "\u7EC6\u9488\u7EC7\u5305\u8EAB\u957F\u88D9", "female", ["modern"], ["\u90FD\u5E02", "\u65E5\u5E38", "\u5973\u4E3B", "\u9B45\u529B", "\u6E29\u67D4"], "\u7EC6\u9488\u7EC7\u5305\u8EAB\u957F\u88D9, \u4E0D\u9732\u80A4\u4F46\u5B8C\u6574\u4EA4\u4EE3\u8EAB\u5F62\u8D77\u4F0F, \u65E5\u5E38\u91CC\u7684\u9AD8\u7EA7\u611F\u3002", {
    inner: "\u8D34\u8EAB\u957F\u886C\u88D9\u9632\u6B62\u9488\u7EC7\u900F\u5149",
    top: "\u9AD8\u9886\u957F\u8896\u7EC6\u9488\u7EC7\u4E0A\u8EAB, \u7EC7\u7EB9\u7EC6\u5BC6\u8D34\u7740\u80F8\u8170\u80A9\u80CC\u8D70, \u8896\u53E3\u4FEE\u957F\u76D6\u4F4F\u624B\u8155",
    bottom: "\u540C\u6599\u957F\u88D9\u6446\u987A\u7740\u8170\u81C0\u5782\u5230\u5C0F\u817F, \u4FA7\u7F1D\u5F00\u4E00\u9053\u4F4E\u8869\u4FBF\u4E8E\u8FC8\u6B65",
    outerwear: "\u957F\u6B3E\u6BDB\u5462\u5927\u8863\u655E\u7740\u7A7F, \u8170\u5E26\u677E\u677E\u7CFB\u5728\u8EAB\u540E",
    legwear: "\u4E2D\u539A\u957F\u889C, \u4E0E\u88D9\u6446\u4E4B\u95F4\u4E0D\u7559\u7F1D\u9699",
    shoes: "\u53CA\u8E1D\u7EC6\u8DDF\u9774, \u978B\u7B52\u8D34\u5408\u811A\u8E1D",
    accessory: "\u4E00\u6761\u7EC6\u957F\u9879\u94FE\u843D\u5728\u80F8\u524D, \u624B\u4E0A\u4E00\u679A\u7D20\u5708\u6212"
  }, ADULT_WIDE),
  c3("glm-mod-female-slit-cocktail", "\u9AD8\u5F00\u8869\u9E21\u5C3E\u9152\u88D9", "female", ["modern", "career"], ["\u4EA4\u9645\u82B1", "\u9152\u4F1A", "\u5973\u914D", "\u9B45\u529B", "\u5FA1\u59D0"], "\u9AD8\u5F00\u8869\u77ED\u793C\u670D, \u4E00\u4FA7\u817F\u90E8\u7EBF\u6761\u5B8C\u6574\u9732\u51FA, \u4E0A\u8EAB\u53CD\u800C\u6536\u5F97\u5E72\u51C0\u3002", {
    inner: "\u5185\u7F6E\u7ED3\u6784\u627F\u6258\u80F8\u7EBF, \u4FA7\u8170\u52A0\u9AA8\u6491\u4F4F\u5ED3\u5F62",
    top: "\u5355\u80A9\u659C\u9886\u4E0A\u8EAB, \u4E00\u4FA7\u80A9\u81C2\u5B8C\u5168\u9732\u51FA, \u53E6\u4E00\u4FA7\u7559\u4E00\u6761\u5BBD\u80A9\u5E26, \u80F8\u8170\u4E4B\u95F4\u4EE5\u659C\u5411\u526A\u88C1\u6536\u7D27",
    bottom: "\u53CA\u819D\u88F9\u8EAB\u88D9\u6446, \u5355\u4FA7\u5F00\u8869\u81EA\u80EF\u4E0B\u5EF6\u4F38, \u8FC8\u6B65\u65F6\u817F\u90E8\u7EBF\u6761\u5B8C\u6574\u663E\u73B0",
    outerwear: "\u77ED\u6B3E\u5C0F\u5916\u5957\u53EA\u5728\u79BB\u573A\u65F6\u62AB\u4E0A",
    legwear: "\u8584\u900F\u957F\u7B52\u889C, \u889C\u53E3\u85CF\u5728\u88D9\u6446\u91CC",
    shoes: "\u7EC6\u5E26\u9AD8\u8DDF\u51C9\u978B, \u811A\u80CC\u4E00\u6761\u659C\u5E26",
    accessory: "\u624B\u62FF\u786C\u58F3\u5C0F\u5305, \u8033\u7EBF\u4E0E\u9888\u94FE\u8D70\u7EC6\u91D1\u5C5E"
  }, ADULT),
  // ================= 中式古装(ancient / period) =================
  c3("glm-anc-female-sheer-hezi-qun", "\u8F7B\u7EB1\u8BC3\u5B50\u88D9", "female", ["ancient", "period"], ["\u53E4\u88C5", "\u8D35\u5973", "\u6B4C\u59EC", "\u5973\u4E3B", "\u9B45\u529B"], "\u8BC3\u5B50\u88D9\u914D\u8584\u7EB1\u5927\u8896\u886B, \u675F\u80F8\u9AD8\u8170\u7684\u5510\u5236\u5F62\u5236, \u7EB1\u6599\u8F7B\u900F\u968F\u6B65\u751F\u98CE\u3002", {
    inner: "\u8BC3\u5B50\u675F\u4E8E\u80F8\u7EBF\u4E4B\u4E0A, \u5E03\u5E45\u6A2A\u88F9\u6536\u7D27, \u4E0A\u7F18\u5E73\u76F4\u9732\u51FA\u9501\u9AA8\u4E0E\u80A9\u5934",
    top: "\u8584\u7EB1\u5927\u8896\u886B\u7F69\u5728\u5916\u5C42, \u524D\u895F\u4E0D\u7CFB\u4EFB\u7531\u655E\u5F00, \u7EB1\u6599\u534A\u900F\u53EF\u89C1\u5185\u91CC\u675F\u80F8\u7684\u6A2A\u7EBF",
    bottom: "\u9AD8\u8170\u957F\u88D9\u81EA\u80F8\u4E0B\u8D77\u7CFB, \u88D9\u8170\u4EE5\u5BBD\u7EC7\u5E26\u675F\u7D27\u52D2\u51FA\u80F8\u8170\u5206\u754C, \u88D9\u5E45\u6781\u591A\u66F3\u5730\u6210\u8936",
    outerwear: "\u957F\u62AB\u5E1B\u7ED5\u8FC7\u53CC\u81C2\u5782\u5230\u819D\u4E0B, \u8D70\u52A8\u65F6\u5728\u8EAB\u540E\u62C9\u51FA\u5F27\u7EBF",
    legwear: "\u7D20\u7F57\u957F\u889C, \u85CF\u4E8E\u88D9\u4E0B",
    shoes: "\u7FD8\u5934\u7EE3\u978B, \u978B\u9762\u7EC6\u7EE3\u7F20\u679D",
    accessory: "\u7EC7\u5E26\u4E0A\u7EE3\u8776\u620F\u82B1\u7EB9, \u53D1\u95F4\u6B65\u6447\u968F\u6B65\u8F7B\u6643"
  }, ADULT),
  c3("glm-anc-female-brocade-ruqun", "\u7EC7\u91D1\u8966\u88D9", "female", ["ancient", "period"], ["\u53E4\u88C5", "\u8D35\u5983", "\u5AE1\u5973", "\u5BAB\u5EF7", "\u9B45\u529B"], "\u7EC7\u91D1\u91CD\u5DE5\u8966\u88D9, \u675F\u8170\u5BBD\u8896\u663E\u8EAB\u4EFD, \u9762\u6599\u539A\u91CD\u6709\u53CD\u5149\u3002", {
    inner: "\u7D20\u7EF8\u4E2D\u8863\u8D34\u8EAB, \u9886\u53E3\u9732\u51FA\u4E00\u7EBF",
    top: "\u4EA4\u9886\u4E0A\u8966\u6536\u7A84\u4E8E\u8170, \u9886\u7F18\u4E0E\u8896\u7F18\u538B\u7EC7\u91D1\u82B1\u8FB9, \u524D\u895F\u4EE5\u7EC6\u5E26\u7CFB\u4E8E\u8170\u4FA7\u52FE\u51FA\u80F8\u8170\u7EBF\u6761",
    bottom: "\u66F3\u5730\u957F\u88D9\u4EE5\u5BBD\u8170\u5C01\u675F\u7D27, \u8170\u5C01\u4E0A\u4E0B\u5F62\u6210\u660E\u663E\u6536\u653E, \u88D9\u9762\u6EE1\u7EE3\u7F20\u679D\u4E0E\u98DE\u8776",
    outerwear: "\u5E7F\u8896\u5BF9\u895F\u5916\u886B\u655E\u7A7F, \u8896\u5E45\u6781\u5927\u5782\u81F3\u819D\u95F4",
    legwear: "\u7D20\u7F57\u957F\u889C",
    shoes: "\u4E91\u5934\u5C65, \u978B\u5934\u5FAE\u7FD8\u7F00\u73E0",
    accessory: "\u8170\u5C01\u4E24\u4FA7\u5782\u7389\u7EC4\u4F69, \u884C\u8D70\u65F6\u76F8\u51FB\u6709\u58F0"
  }, ADULT_WIDE),
  c3("glm-anc-female-silk-boudoir", "\u5185\u5BA4\u8584\u7EF8\u5BDD\u8863", "female", ["ancient", "period"], ["\u53E4\u88C5", "\u95FA\u9601", "\u5185\u5BA4", "\u5973\u4E3B", "\u9B45\u529B"], "\u5185\u5BA4\u8584\u7EF8\u5BDD\u8863, \u4EA4\u9886\u677E\u7CFB, \u6750\u8D28\u6781\u8F6F\u8D34\u7740\u8EAB\u5F62\u5782\u5760\u3002", {
    inner: "\u8D34\u8EAB\u675F\u80F8\u5E03\u5E45, \u4E0A\u7F18\u5E73\u76F4, \u7CFB\u5E26\u5728\u80CC\u540E",
    top: "\u8584\u7EF8\u4EA4\u9886\u4E0A\u8863, \u8863\u895F\u677E\u677E\u4EA4\u53E0\u53EA\u4EE5\u4E00\u6761\u7EC6\u5E26\u7CFB\u4F4F, \u5E03\u6599\u8F6F\u584C\u987A\u7740\u80A9\u80CC\u4E0E\u80F8\u8170\u5782\u843D",
    bottom: "\u540C\u6599\u957F\u88D9\u6563\u7CFB\u4E8E\u8170\u4E0B, \u5E03\u5E45\u5782\u987A\u4E0D\u505A\u6491\u5F20, \u8D70\u52A8\u65F6\u8D34\u7740\u817F\u578B",
    outerwear: "\u7F69\u4E00\u4EF6\u66F4\u8584\u7684\u7EB1\u8863, \u534A\u900F\u53EF\u89C1\u5185\u5C42\u8863\u7EB9",
    legwear: "\u8D64\u8DB3\u6216\u6781\u8584\u7D20\u889C",
    shoes: "\u8F6F\u5E95\u7F0E\u9762\u4FBF\u978B, \u65E0\u8DDF\u65E0\u58F0",
    accessory: "\u957F\u53D1\u677E\u6563\u672A\u675F, \u8155\u4E0A\u4E00\u53EA\u7D20\u956F"
  }, ADULT),
  c3("glm-anc-female-dancer-gauze", "\u4E50\u821E\u8F7B\u7EB1\u821E\u8863", "female", ["ancient", "period"], ["\u53E4\u88C5", "\u821E\u59EC", "\u4E50\u4F0E", "\u5973\u914D", "\u9B45\u529B"], "\u821E\u4F0E\u8F7B\u7EB1\u821E\u8863, \u675F\u8170\u9732\u81C2, \u591A\u5C42\u8584\u7EB1\u968F\u65CB\u8F6C\u6563\u5F00\u3002", {
    inner: "\u77ED\u675F\u80F8\u62B9\u80F8, \u540E\u80CC\u4EA4\u53C9\u7CFB\u5E26\u56FA\u5B9A",
    top: "\u77ED\u7F69\u886B\u53EA\u5230\u808B\u4E0B, \u53CC\u81C2\u5168\u9732, \u9886\u53E3\u5E73\u76F4\u8D34\u7740\u80F8\u7EBF\u4E0A\u7F18",
    bottom: "\u591A\u5C42\u8584\u7EB1\u957F\u88D9\u81EA\u8170\u4E0B\u6563\u51FA, \u8170\u95F4\u4EE5\u6570\u9053\u7EC6\u5E26\u5C42\u5C42\u675F\u7D27\u52D2\u51FA\u8170\u8EAB, \u88D9\u5C42\u65CB\u8F6C\u65F6\u5F20\u5F00\u5982\u8F6E",
    outerwear: "\u957F\u98D8\u5E26\u81EA\u53CC\u8155\u5782\u4E0B, \u821E\u52A8\u65F6\u5728\u7A7A\u4E2D\u62C9\u51FA\u7EBF\u6761",
    legwear: "\u7EC6\u7EF3\u7ED1\u817F\u81EA\u811A\u8E1D\u76D8\u5230\u5C0F\u817F\u4E2D\u6BB5",
    shoes: "\u8F6F\u5E95\u821E\u978B, \u978B\u9762\u7F00\u7EC6\u94C3",
    accessory: "\u8170\u95F4\u4E0E\u8155\u95F4\u7684\u7EC6\u94C3\u968F\u52A8\u4F5C\u4F5C\u54CD"
  }, ADULT),
  c3("glm-anc-female-court-consort", "\u5BAB\u88C5\u91CD\u5DE5\u793C\u670D", "female", ["ancient", "period"], ["\u53E4\u88C5", "\u7687\u540E", "\u8D35\u5983", "\u5BAB\u6597", "\u9B45\u529B"], "\u5BAB\u88C5\u793C\u670D, \u5F62\u5236\u7AEF\u5E84\u4F46\u7528\u91CD\u5DE5\u4E0E\u675F\u8170\u628A\u8EAB\u5F62\u4EA4\u4EE3\u6E05\u695A\u3002", {
    inner: "\u7D20\u7EF8\u4E2D\u8863\u4E24\u5C42, \u9886\u53E3\u5C42\u5C42\u53E0\u51FA",
    top: "\u5927\u8896\u5BF9\u895F\u5BAB\u88C5\u4E0A\u8863, \u9886\u7F18\u4E0E\u524D\u895F\u6EE1\u7EE3\u51E4\u7EB9\u4E0E\u82B1\u679D, \u80A9\u7EBF\u5E73\u633A, \u8170\u4E0B\u6536\u675F",
    bottom: "\u66F3\u5730\u88D9\u6446\u6781\u957F, \u8170\u5C01\u5BBD\u800C\u786C\u633A\u675F\u51FA\u8170\u7EBF, \u88D9\u9762\u5206\u5E45\u7EE3\u6D77\u6C34\u6C5F\u5D16",
    outerwear: "\u957F\u7F69\u886B\u5782\u5730, \u8863\u7F18\u538B\u7EC7\u91D1\u9614\u8FB9",
    legwear: "\u7D20\u7F57\u957F\u889C",
    shoes: "\u9AD8\u5E95\u7FD8\u5934\u5C65, \u8D70\u52A8\u6B65\u5E45\u53D7\u9650\u53CD\u663E\u4EEA\u6001",
    accessory: "\u6574\u5957\u5934\u9762\u4E0E\u538B\u895F\u5782\u9970, \u884C\u6B62\u4E0D\u5F97\u6025"
  }, ADULT_WIDE),
  c3("glm-anc-female-swordswoman", "\u6C5F\u6E56\u5973\u4FA0\u675F\u8EAB\u52B2\u88C5", "female", ["ancient", "period"], ["\u53E4\u88C5", "\u5973\u4FA0", "\u6C5F\u6E56", "\u6B66\u6253", "\u9B45\u529B"], "\u5973\u4FA0\u52B2\u88C5, \u675F\u80F8\u675F\u8170\u4FBF\u4E8E\u884C\u52A8, \u5F00\u8869\u957F\u888D\u9732\u51FA\u817F\u90E8\u7EBF\u6761\u3002", {
    inner: "\u675F\u80F8\u5E03\u5E45\u7F20\u7D27, \u5916\u5C42\u4E0D\u663E\u75D5\u8FF9",
    top: "\u7A84\u8896\u4EA4\u9886\u77ED\u6253, \u8896\u53E3\u4EE5\u62A4\u8155\u6536\u7D27, \u524D\u895F\u4EE5\u6570\u9053\u6A2A\u5E26\u675F\u4F4F\u52FE\u51FA\u80F8\u8170\u8D77\u4F0F",
    bottom: "\u5916\u5C42\u957F\u888D\u524D\u540E\u5F00\u8869\u5230\u80EF, \u5185\u7A7F\u675F\u811A\u957F\u88E4, \u8FC8\u6B65\u65F6\u888D\u6446\u5206\u5F00\u9732\u51FA\u817F\u578B",
    outerwear: "\u77ED\u62AB\u98CE\u53EA\u5230\u80A9\u80DB, \u9886\u53E3\u4EE5\u517D\u9996\u6263\u6263\u4F4F",
    legwear: "\u76AE\u8D28\u7ED1\u817F\u81EA\u811A\u8E1D\u7F20\u81F3\u819D\u4E0B",
    shoes: "\u8F6F\u5E95\u5FEB\u9774, \u9774\u7B52\u8D34\u5408\u5C0F\u817F",
    accessory: "\u8170\u95F4\u9769\u5E26\u60AC\u5251, \u675F\u5E26\u52D2\u51FA\u660E\u663E\u8170\u7EBF"
  }, ADULT),
  c3("glm-xian-female-immortal-gauze", "\u4ED9\u95E8\u98D8\u7EB1\u88D9", "female", ["xianxia", "fantasy"], ["\u4ED9\u4FA0", "\u4ED9\u5B50", "\u5E08\u5C0A", "\u5973\u4E3B", "\u9B45\u529B"], "\u591A\u5C42\u98D8\u7EB1\u4ED9\u88D9, \u675F\u8170\u9732\u80CC, \u7EB1\u5C42\u8F7B\u5230\u8FD1\u4E4E\u65E0\u91CD\u91CF\u3002", {
    inner: "\u8D34\u8EAB\u675F\u80F8, \u540E\u80CC\u7559\u5927\u7247\u7A7A\u6863\u914D\u5408\u5916\u5C42\u9732\u80CC",
    top: "\u8584\u7EB1\u4EA4\u9886\u4E0A\u8863, \u540E\u80CC\u5F00\u81F3\u8170\u9645\u53EA\u4EE5\u4E24\u9053\u7EC6\u5E26\u4EA4\u53C9\u76F8\u8FDE, \u524D\u895F\u4EE5\u4E91\u7EB9\u7CFB\u5E26\u675F\u4E8E\u80F8\u4E0B",
    bottom: "\u591A\u5C42\u66F3\u5730\u7EB1\u88D9, \u8170\u95F4\u4EE5\u5BBD\u7EC7\u5E26\u675F\u7D27, \u88D9\u5C42\u7531\u5185\u5411\u5916\u6E10\u8584, \u884C\u8D70\u65F6\u5C42\u5C42\u9519\u5F00",
    outerwear: "\u6781\u957F\u5E7F\u8896\u5916\u7EB1\u886B, \u8896\u5E45\u5782\u5730\u968F\u98CE\u6D6E\u8D77",
    legwear: "\u65E0, \u88D9\u5C42\u5DF2\u53CA\u5730",
    shoes: "\u8F6F\u5E95\u4E91\u5C65, \u978B\u9762\u7EE3\u6D41\u4E91",
    accessory: "\u8170\u5E26\u4E0A\u5782\u7EC6\u957F\u7EE6\u5B50\u4E0E\u7389\u73AF, \u53D1\u5E26\u540C\u6599\u968F\u7EB1\u98D8\u52A8"
  }, ADULT),
  c3("glm-xian-female-demon-empress", "\u9B54\u9053\u675F\u8170\u957F\u888D", "female", ["xianxia", "fantasy"], ["\u4ED9\u4FA0", "\u9B54\u5973", "\u5973\u53CD", "\u5C0A\u4E3B", "\u9B45\u529B"], "\u9B54\u9053\u5973\u4FEE\u957F\u888D, \u9AD8\u9886\u675F\u8170\u914D\u5927\u5F00\u8869, \u6750\u8D28\u539A\u91CD\u538B\u5F97\u4F4F\u6C14\u573A\u3002", {
    inner: "\u8D34\u8EAB\u6697\u7EB9\u5185\u886C, \u9886\u53E3\u9AD8\u81F3\u9888\u6839",
    top: "\u7ACB\u9886\u957F\u888D\u4E0A\u8EAB, \u80A9\u7EBF\u52A0\u5BBD\u505A\u51FA\u538B\u8FEB\u611F, \u80F8\u8170\u4EE5\u6570\u9053\u76AE\u8D28\u675F\u5E26\u52D2\u7D27\u6536\u51FA\u66F2\u7EBF",
    bottom: "\u957F\u888D\u4E0B\u6446\u524D\u5F00\u5927\u8869, \u5185\u7A7F\u8D34\u8EAB\u957F\u88E4, \u884C\u8D70\u65F6\u888D\u6446\u5206\u5411\u4E24\u4FA7",
    outerwear: "\u66F3\u5730\u5927\u6C05, \u9886\u53E3\u4E00\u5708\u539A\u6BDB, \u53EA\u62AB\u4E0D\u7CFB",
    legwear: "\u8D34\u8EAB\u957F\u88E4\u5916\u52A0\u62A4\u80EB",
    shoes: "\u539A\u5E95\u957F\u9774, \u9774\u7B52\u8FC7\u819D",
    accessory: "\u675F\u5E26\u6263\u4EF6\u94F8\u6210\u517D\u7EB9, \u6307\u95F4\u6570\u679A\u5BBD\u9762\u6212\u6307"
  }, ADULT_WIDE),
  // ================= 民国(republican) =================
  c3("glm-rep-female-lace-qipao", "\u6C11\u56FD\u857E\u4E1D\u65D7\u888D", "female", ["republican", "period"], ["\u6C11\u56FD", "\u540D\u5A9B", "\u4EA4\u9645\u82B1", "\u65D7\u888D", "\u9B45\u529B"], "\u6C11\u56FD\u857E\u4E1D\u65D7\u888D, \u76D8\u6263\u7ACB\u9886\u4E0E\u9AD8\u5F00\u8869\u5E76\u5B58, \u857E\u4E1D\u5C42\u900F\u51FA\u5185\u886C\u7EBF\u6761\u3002", {
    inner: "\u7D20\u7EF8\u886C\u88D9, \u957F\u5EA6\u7565\u77ED\u4E8E\u5916\u5C42\u8BA9\u857E\u4E1D\u4E0B\u6446\u900F\u7A7A",
    top: "\u857E\u4E1D\u65D7\u888D\u4E0A\u8EAB, \u7ACB\u9886\u4EE5\u4E00\u5B57\u76D8\u6263\u6263\u5230\u9888\u4E0B, \u8896\u53E3\u5F00\u5728\u8098\u4E0A, \u80F8\u8170\u4EE5\u66F2\u7EBF\u526A\u88C1\u8D34\u5408",
    bottom: "\u65D7\u888D\u4E0B\u6446\u5305\u4F4F\u8170\u81C0, \u53CC\u4FA7\u5F00\u8869\u81F3\u5927\u817F, \u5F00\u8869\u8FB9\u538B\u7EC6\u6EDA\u8FB9",
    outerwear: "\u77ED\u6B3E\u4E1D\u7ED2\u5C0F\u5916\u5957\u53EA\u5230\u8170, \u655E\u7A7F\u4E0D\u6263",
    legwear: "\u8584\u900F\u957F\u7B52\u889C, \u889C\u7F1D\u5728\u540E\u817F\u7559\u4E00\u9053\u76F4\u7EBF",
    shoes: "\u7EC6\u8DDF\u739B\u4E3D\u73CD\u978B, \u811A\u80CC\u4E00\u9053\u6A2A\u6263\u5E26",
    accessory: "\u624B\u5305\u4E0E\u957F\u4E32\u73E0\u94FE, \u857E\u4E1D\u82B1\u7EB9\u4EE5\u7F20\u679D\u5C0F\u82B1\u4E3A\u4E3B"
  }, ADULT_WIDE),
  c3("glm-rep-female-satin-cheongsam-night", "\u591C\u573A\u7F0E\u9762\u65D7\u888D", "female", ["republican", "period"], ["\u6C11\u56FD", "\u6B4C\u5973", "\u821E\u5385", "\u5973\u914D", "\u9B45\u529B"], "\u591C\u573A\u7F0E\u9762\u65D7\u888D, \u6750\u8D28\u6C34\u5149\u5F3A, \u5F00\u8869\u4E0E\u523A\u7EE3\u90FD\u6BD4\u65E5\u5E38\u5F20\u626C\u4E00\u6863\u3002", {
    inner: "\u8D34\u8EAB\u886C\u88D9\u505A\u65E0\u75D5\u5904\u7406, \u4FDD\u8BC1\u7F0E\u9762\u4E0D\u8D77\u76B1",
    top: "\u7F0E\u9762\u65D7\u888D\u4E0A\u8EAB, \u7ACB\u9886\u504F\u4F4E\u9732\u51FA\u9888\u7EBF, \u65E0\u8896\u9732\u51FA\u6574\u6761\u624B\u81C2, \u80F8\u8170\u4E4B\u95F4\u4EE5\u7701\u9053\u6258\u51FA\u66F2\u7EBF",
    bottom: "\u4E0B\u6446\u53CA\u8E1D\u8D34\u5408\u8170\u81C0, \u5355\u4FA7\u5F00\u8869\u6781\u9AD8, \u5185\u4FA7\u538B\u4E00\u5C42\u7EE3\u82B1\u8D34\u8FB9\u968F\u6B65\u663E\u9732",
    outerwear: "\u957F\u7ED2\u62AB\u80A9\u642D\u5728\u53CC\u81C2\u4E4B\u95F4",
    legwear: "\u8584\u900F\u957F\u889C\u914D\u540A\u889C\u7ED3\u6784, \u85CF\u5728\u5F00\u8869\u4E4B\u5185",
    shoes: "\u7EC6\u9AD8\u8DDF\u821E\u978B, \u978B\u9762\u7F0E\u6599\u53CD\u5149",
    accessory: "\u82B1\u5349\u4E0E\u98DE\u8776\u523A\u7EE3\u81EA\u4E0B\u6446\u76D8\u65CB\u81F3\u8170\u4FA7, \u8033\u5760\u957F\u800C\u5782"
  }, ADULT_WIDE)
];

// services/characterStylingWardrobeCapsules.ts
var slot6 = (detail, material) => ({
  label: detail.replace(/[，,].*$/, ""),
  material: material || detail,
  detail
});
var capsule3 = (id, label, gender, eras, roleTags, summary, slots3, ageBands) => ({
  id,
  label,
  gender,
  eras,
  roleTags,
  summary,
  ageBands,
  slots: {
    inner: slot6(slots3.inner),
    top: slot6(slots3.top),
    bottom: slot6(slots3.bottom),
    outerwear: slot6(slots3.outerwear),
    legwear: slot6(slots3.legwear),
    shoes: slot6(slots3.shoes),
    accessory: slot6(slots3.accessory)
  }
});
var BASE_WARDROBE_CAPSULES = [
  capsule3("career-female-lawyer-ivory", "\u51B7\u767D\u5973\u5F8B\u5E08\u9AD8\u5B9A\u5957\u88C5", "female", ["modern", "career"], ["\u5F8B\u5E08", "\u5973\u4E3B", "\u804C\u4E1A", "\u51B7\u611F"], "\u73B0\u4EE3\u804C\u4E1A\u5973\u6027\uFF0C\u51B7\u767D\u3001\u5229\u843D\u3001\u6709\u80DC\u8BC9\u611F\uFF0C\u9002\u5408\u5973\u5F8B\u5E08/\u5973\u4E3B\u53CD\u51FB\u7EBF\u3002", {
    inner: "\u8C61\u7259\u767D\u771F\u4E1D\u98D8\u5E26\u886C\u886B\uFF0C\u9886\u53E3\u5782\u5760\u67D4\u5149\uFF0C\u8896\u53E3\u7EC6\u8936\u6E05\u695A",
    top: "\u6D45\u7070\u77ED\u6B3E\u6536\u8170\u897F\u88C5\u4E0A\u88C5\uFF0C\u7EC6\u7F8A\u6BDB\u6750\u8D28\uFF0C\u80A9\u7EBF\u5229\u843D\uFF0C\u8170\u90E8\u6709\u7701\u9053",
    bottom: "\u6DF1\u7070\u9AD8\u8170\u94C5\u7B14\u88D9\uFF0C\u819D\u4E0A\u5230\u819D\u4E2D\u957F\u5EA6\uFF0C\u540E\u5F00\u8869\uFF0C\u88D9\u8EAB\u8D34\u5408\u4F46\u4E0D\u7D27\u7EF7",
    outerwear: "\u51B7\u767D\u957F\u6B3E\u8584\u5462\u5927\u8863\uFF0C\u7A84\u7FFB\u9886\uFF0C\u8170\u5E26\u81EA\u7136\u5782\u843D\uFF0C\u5916\u5C42\u50CF\u5B9A\u5236\u6B3E",
    legwear: "\u70DF\u7070\u534A\u900F\u660E\u7EC6\u5BC6\u889C\u6750\uFF0C\u4F4E\u53CD\u5149\uFF0C\u817F\u90E8\u7EBF\u6761\u6E05\u695A",
    shoes: "\u7070\u767D\u5C16\u5934\u7EC6\u8DDF\u978B\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u978B\u578B\u4FEE\u957F",
    accessory: "\u7EC6\u94F6\u8033\u9489\u3001\u51B7\u94F6\u8155\u8868\u3001\u7A84\u8170\u5E26\uFF0C\u65E0\u53EF\u8BFB\u6587\u5B57\u5FBD\u7AE0"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("career-female-ceo-black-gold", "\u9ED1\u91D1\u5973\u603B\u88C1\u6743\u529B\u5957\u88C5", "female", ["modern", "career"], ["\u5973\u603B\u88C1", "\u9738\u603B", "\u5973\u53CD", "\u804C\u4E1A"], "\u9AD8\u538B\u90FD\u5E02\u6743\u529B\u611F\uFF0C\u9ED1\u91D1\u3001\u6536\u8170\u3001\u5F3A\u80A9\u7EBF\uFF0C\u9002\u5408\u5973\u603B\u88C1/\u5973\u53CD\u3002", {
    inner: "\u9ED1\u8272\u7EC6\u9488\u7EC7\u9AD8\u9886\u5185\u642D\uFF0C\u4F4E\u53CD\u5149\uFF0C\u8D34\u5408\u80A9\u9888\u7EBF",
    top: "\u9ED1\u91D1\u77ED\u6B3E\u9AD8\u5B9A\u897F\u88C5\u4E0A\u88C5\uFF0C\u786C\u633A\u57AB\u80A9\uFF0C\u6697\u91D1\u6263\u4EF6\uFF0C\u8170\u90E8\u660E\u663E\u6536\u675F",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u76F4\u7B52\u897F\u88E4\uFF0C\u88E4\u7EBF\u950B\u5229\uFF0C\u817F\u90E8\u6BD4\u4F8B\u62C9\u957F",
    outerwear: "\u9ED1\u8272\u7F8A\u6BDB\u62AB\u80A9\u5F0F\u5927\u8863\uFF0C\u7F0E\u9762\u7FFB\u9886\uFF0C\u5916\u8F6E\u5ED3\u5F3A\u52BF\u4F46\u4E0D\u81C3\u80BF",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u76F4\u7B52\u88E4\u7EBF\u548C\u9AD8\u8170\u6BD4\u4F8B",
    shoes: "\u9ED1\u8272\u5C16\u5934\u9AD8\u8DDF\u77ED\u9774\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u978B\u53E3\u5229\u843D",
    accessory: "\u6697\u91D1\u7EC6\u9879\u94FE\u3001\u91D1\u5C5E\u8033\u6263\u3001\u9ED1\u91D1\u7EC6\u8170\u5E26\uFF0C\u8D35\u4F46\u514B\u5236"
  }, ["29-38", "39-50"]),
  capsule3("career-female-secretary-luxe", "\u8F7B\u5962\u79D8\u4E66\u77ED\u88D9\u5957\u88C5", "female", ["modern", "career"], ["\u79D8\u4E66", "\u52A9\u7406", "\u767D\u6708\u5149", "\u804C\u4E1A"], "\u90FD\u5E02\u8F7B\u5962\u79D8\u4E66\u7EBF\uFF0C\u7CBE\u81F4\u3001\u5438\u775B\u4F46\u4E0D\u6D6E\u5938\u3002", {
    inner: "\u5976\u6CB9\u767D\u4E1D\u7F0E\u540A\u5E26\u5185\u5C42\uFF0C\u67D4\u5149\u5782\u5760\uFF0C\u9886\u53E3\u5E72\u51C0",
    top: "\u6D45\u9A7C\u77ED\u6B3E\u9488\u7EC7\u5C0F\u9999\u98CE\u4E0A\u88C5\uFF0C\u7EC6\u5BC6\u7F16\u7EC7\uFF0C\u91D1\u5C5E\u5C0F\u6263",
    bottom: "\u5976\u8336\u8272\u9AD8\u8170A\u5B57\u77ED\u88D9\uFF0C\u786C\u633A\u88D9\u6446\uFF0C\u8170\u7EBF\u660E\u786E",
    outerwear: "\u7C73\u767D\u77ED\u6B3E\u5C0F\u9999\u98CE\u5916\u5957\uFF0C\u7C97\u82B1\u5462\u6750\u8D28\uFF0C\u8FB9\u7F18\u6EDA\u8FB9\u6E05\u695A",
    legwear: "\u81EA\u7136\u80A4\u8272\u817F\u90E8\uFF0C\u76AE\u80A4\u54D1\u5149\uFF0C\u817F\u90E8\u7EBF\u6761\u4FEE\u957F",
    shoes: "\u88F8\u8272\u5C16\u5934\u7EC6\u8DDF\u978B\uFF0C\u4F4E\u53CD\u5149\u76AE\u9769\uFF0C\u811A\u80CC\u7EBF\u6761\u5E72\u51C0",
    accessory: "\u73CD\u73E0\u8033\u9489\u3001\u7EC6\u91D1\u624B\u94FE\u3001\u5C0F\u53F7\u8170\u94FE\uFF0C\u4E0D\u80FD\u624B\u6301\u6587\u4EF6"
  }, ["21-28", "29-38"]),
  capsule3("career-female-doctor-clean", "\u5973\u533B\u751F\u6E05\u723D\u767D\u888D\u5957\u88C5", "female", ["modern", "career"], ["\u533B\u751F", "\u62A4\u58EB", "\u5973\u4E3B", "\u804C\u4E1A"], "\u533B\u7597\u804C\u4E1A\u8BC6\u522B\uFF0C\u767D\u888D\u5E72\u51C0\u3001\u6709\u53EF\u4FE1\u5EA6\uFF0C\u540C\u65F6\u4FDD\u6301\u77ED\u5267\u4E3B\u89D2\u7F8E\u611F\u3002", {
    inner: "\u6D45\u84DD\u9AD8\u652F\u68C9\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u8896\u53E3\u5E72\u51C0",
    top: "\u767D\u8272\u4FEE\u8EAB\u533B\u7597\u4E0A\u8863\uFF0C\u80A9\u7EBF\u81EA\u7136\uFF0C\u65E0\u53EF\u8BFB\u6587\u5B57",
    bottom: "\u85CF\u84DD\u76F4\u7B52\u897F\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A\uFF0C\u5E03\u6599\u633A\u62EC",
    outerwear: "\u767D\u8272\u533B\u751F\u957F\u888D\uFF0C\u54D1\u5149\u539A\u68C9\u6DF7\u7EBA\uFF0C\u53E3\u888B\u548C\u95E8\u895F\u7ED3\u6784\u6E05\u695A\uFF0C\u65E0\u59D3\u540D\u724C\u6587\u5B57",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u5E72\u51C0\u88E4\u7EBF",
    shoes: "\u767D\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u978B\u9762\u5E72\u51C0\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u7EC6\u94F6\u8155\u8868\u3001\u6781\u7B80\u8033\u9489\u3001\u65E0\u6587\u5B57\u80F8\u524D\u7ED3\u6784\u4EF6"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("career-female-police-sharp", "\u5973\u8B66\u5229\u843D\u5236\u670D\u5957\u88C5", "female", ["modern", "career"], ["\u8B66\u5BDF", "\u5236\u670D", "\u5973\u4E3B", "\u786C\u6717"], "\u6267\u6CD5\u5973\u6027\uFF0C\u82F1\u6C14\u3001\u4E13\u4E1A\u3001\u80A9\u80CC\u633A\uFF0C\u907F\u514D\u53EF\u8BFB\u6587\u5B57\u3002", {
    inner: "\u6DF1\u8272\u8D34\u8EAB\u8BAD\u7EC3\u5185\u642D\uFF0C\u54D1\u5149\u5F39\u6027\u9762\u6599\uFF0C\u9886\u53E3\u5E73\u6574",
    top: "\u6DF1\u85CF\u84DD\u5236\u670D\u886C\u886B\uFF0C\u80A9\u7AE0\u7ED3\u6784\u4FDD\u7559\u4F46\u65E0\u53EF\u8BFB\u6587\u5B57\uFF0C\u8170\u7EBF\u6536\u7D27",
    bottom: "\u6DF1\u85CF\u84DD\u9AD8\u8170\u5236\u670D\u957F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u884C\u52A8\u611F\u5F3A",
    outerwear: "\u77ED\u6B3E\u6267\u52E4\u5939\u514B\uFF0C\u633A\u62EC\u5236\u670D\u5E03\uFF0C\u80A9\u7EBF\u548C\u53E3\u888B\u7ED3\u6784\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u884C\u52A8\u59FF\u6001",
    shoes: "\u9ED1\u8272\u77ED\u7B52\u6267\u52E4\u9774\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u978B\u5E95\u7ED3\u5B9E",
    accessory: "\u9ED1\u8272\u8170\u5E26\u3001\u7B80\u6D01\u5BF9\u8BB2\u7ED3\u6784\u4EF6\u3001\u65E0\u6587\u5B57\u91D1\u5C5E\u6263"
  }, ["21-28", "29-38"]),
  capsule3("career-female-news-anchor", "\u5973\u4E3B\u64AD\u955C\u5934\u611F\u5957\u88C5", "female", ["modern", "career"], ["\u4E3B\u64AD", "\u4E3B\u6301", "\u540D\u5A9B", "\u5973\u4E3B"], "\u955C\u5934\u4E2D\u5FC3\u611F\uFF0C\u8138\u90E8\u88AB\u8863\u9886\u548C\u989C\u8272\u6258\u4F4F\uFF0C\u9002\u5408\u4E3B\u64AD/\u4E3B\u6301/\u540D\u5A9B\u3002", {
    inner: "\u73CD\u73E0\u767D\u7F0E\u9762\u5185\u642D\uFF0C\u67D4\u5149\u4E0D\u6CB9\u4EAE\uFF0C\u9886\u53E3\u5E73\u6574",
    top: "\u5B9D\u84DD\u6536\u8170\u77ED\u4E0A\u88C5\uFF0C\u7EC6\u5462\u6750\u8D28\uFF0C\u9886\u53E3\u5F27\u7EBF\u7CBE\u81F4",
    bottom: "\u767D\u8272\u9AD8\u8170\u5305\u81C0\u88D9\uFF0C\u88D9\u8EAB\u5E72\u51C0\uFF0C\u8170\u90E8\u526A\u88C1\u6E05\u695A",
    outerwear: "\u5B9D\u84DD\u77ED\u6B3E\u897F\u88C5\u5916\u5957\uFF0C\u8F7B\u57AB\u80A9\uFF0C\u94F6\u8272\u5C0F\u6263",
    legwear: "\u81EA\u7136\u80A4\u8272\u817F\u90E8\uFF0C\u819D\u76D6\u548C\u5C0F\u817F\u7EBF\u6761\u81EA\u7136",
    shoes: "\u767D\u8272\u5C16\u5934\u9AD8\u8DDF\u978B\uFF0C\u7EC6\u8DDF\uFF0C\u978B\u9762\u4F4E\u53CD\u5149",
    accessory: "\u73CD\u73E0\u8033\u5760\u3001\u7EC6\u94F6\u6212\u6307\u3001\u65E0\u53F0\u6807\u65E0\u9EA6\u514B\u98CE"
  }, ["21-28", "29-38"]),
  capsule3("career-female-cyber-agent", "\u8D5B\u535A\u5973\u7279\u5DE5\u5957\u88C5", "female", ["modern", "career", "fantasy"], ["\u79D1\u5E7B", "\u8D5B\u535A", "\u7279\u5DE5", "\u5F02\u80FD"], "\u8FD1\u672A\u6765\u8D5B\u535A\u5973\u7279\u5DE5\uFF0C\u9ED1\u94F6\u3001\u673A\u80FD\u3001\u51B7\u5149\uFF0C\u9002\u5408\u79D1\u5E7B/\u5F02\u80FD\u77ED\u5267\u3002", {
    inner: "\u9ED1\u8272\u8D34\u8EAB\u673A\u80FD\u5185\u5C42\uFF0C\u54D1\u5149\u5F39\u6027\u7EC7\u7269\uFF0C\u80A9\u9888\u7EBF\u6E05\u695A",
    top: "\u94F6\u7070\u77ED\u6B3E\u7ED3\u6784\u4E0A\u88C5\uFF0C\u62FC\u63A5\u76AE\u9769\u548C\u5F39\u6027\u5E03\uFF0C\u80F8\u80CC\u7EBF\u6761\u5229\u843D",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u673A\u80FD\u77ED\u88D9\u88E4\uFF0C\u9690\u85CF\u5F0F\u53E3\u888B\uFF0C\u8170\u90E8\u91D1\u5C5E\u6263",
    outerwear: "\u9ED1\u94F6\u77ED\u6B3E\u673A\u8F66\u5916\u5957\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u51B7\u94F6\u62C9\u94FE\u548C\u80A9\u90E8\u7ED3\u6784",
    legwear: "\u9ED1\u8272\u534A\u900F\u660E\u889C\u6750\u6216\u8D34\u8EAB\u673A\u80FD\u62A4\u817F\uFF0C\u4F4E\u53CD\u5149",
    shoes: "\u9ED1\u8272\u539A\u5E95\u77ED\u9774\uFF0C\u51B7\u94F6\u6263\u4EF6\uFF0C\u884C\u52A8\u611F\u5F3A",
    accessory: "\u51B7\u94F6\u8033\u9AA8\u5939\u3001\u7A84\u8170\u5E26\u3001\u65E0\u6587\u5B57\u51E0\u4F55\u91D1\u5C5E\u4EF6"
  }, ["21-28", "29-38"]),
  capsule3("modern-female-socialite-party", "\u8C6A\u95E8\u540D\u5A9B\u665A\u5BB4\u5957\u88C5", "female", ["modern", "career", "rural"], ["\u5343\u91D1", "\u540D\u5A9B", "\u5973\u53CD", "\u8C6A\u95E8", "\u5BB4\u4F1A", "\u665A\u5BB4", "\u665A\u793C\u670D"], "\u8C6A\u95E8\u665A\u5BB4\u89C6\u89C9\uFF0C\u660E\u8273\u3001\u8D35\u3001\u9002\u5408\u5973\u53CD\u548C\u5343\u91D1\u3002", {
    inner: "\u9ED1\u8272\u7F0E\u9762\u8D34\u8EAB\u5185\u5C42\uFF0C\u67D4\u5149\u5782\u5760\uFF0C\u9886\u53E3\u7CBE\u81F4",
    top: "\u9152\u7EA2\u62B9\u80F8\u5F0F\u7ED3\u6784\u4E0A\u88C5\uFF0C\u7F0E\u9762\u4E0E\u786C\u7EB1\u62FC\u63A5\uFF0C\u8170\u7EBF\u6781\u6E05\u695A",
    bottom: "\u9152\u7EA2\u9C7C\u5C3E\u957F\u88D9\uFF0C\u88D9\u6446\u6709\u786C\u7EB1\u5C42\u6B21\uFF0C\u884C\u8D70\u611F\u5F3A",
    outerwear: "\u9ED1\u8272\u77ED\u6B3E\u4E1D\u7ED2\u62AB\u80A9\uFF0C\u8FB9\u7F18\u6697\u91D1\u6EDA\u8FB9\uFF0C\u9732\u51FA\u80A9\u9888\u7EBF",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u88D9\u6446\u548C\u9AD8\u8170\u6BD4\u4F8B",
    shoes: "\u9152\u7EA2\u7EC6\u8DDF\u9AD8\u8DDF\u978B\uFF0C\u7F0E\u9762\u4F4E\u53CD\u5149",
    accessory: "\u7EA2\u5B9D\u77F3\u8033\u5760\u3001\u6697\u91D1\u624B\u956F\u3001\u7EC6\u8170\u94FE\uFF0C\u8D35\u6C14\u5F3A\u8BB0\u5FC6\u70B9"
  }, ["21-28", "29-38"]),
  capsule3("modern-female-bridal-drama", "\u77ED\u5267\u65B0\u5A18\u793C\u670D\u5957\u88C5", "female", ["modern", "rural"], ["\u65B0\u5A18", "\u5A5A\u793C", "\u5A5A\u7EB1", "\u66FF\u5AC1", "\u767D\u6708\u5149", "\u5973\u4E3B"], "\u5A5A\u793C/\u9003\u5A5A/\u66FF\u5AC1\u573A\u666F\uFF0C\u767D\u7EB1\u4F46\u6709\u8EAB\u6750\u548C\u955C\u5934\u8BB0\u5FC6\u70B9\u3002", {
    inner: "\u8C61\u7259\u767D\u7F0E\u9762\u5185\u5C42\uFF0C\u8D34\u5408\u80A9\u9888\uFF0C\u67D4\u5149\u6750\u8D28",
    top: "\u767D\u8272\u7ACB\u4F53\u526A\u88C1\u793C\u670D\u4E0A\u8EAB\uFF0C\u6536\u8170\u660E\u663E\uFF0C\u7EC6\u857E\u4E1D\u7EB9\u7406",
    bottom: "\u767D\u8272\u9AD8\u8170\u9C7C\u5C3E\u88D9\u6446\uFF0C\u7EB1\u5C42\u8F7B\u8584\uFF0C\u80CC\u9762\u62D6\u5C3E\u77ED\u800C\u5229\u843D",
    outerwear: "\u900F\u660E\u8584\u7EB1\u77ED\u62AB\u80A9\uFF0C\u8FB9\u7F18\u7EC6\u73E0\u7EE3\uFF0C\u4E0D\u80FD\u906E\u4F4F\u8170\u7EBF",
    legwear: "\u88D9\u6446\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u9AD8\u8170\u6BD4\u4F8B\u548C\u7EB1\u5C42\u5C42\u6B21",
    shoes: "\u73CD\u73E0\u767D\u7EC6\u8DDF\u978B\uFF0C\u978B\u9762\u7F0E\u5149\u514B\u5236",
    accessory: "\u5C0F\u9897\u73CD\u73E0\u8033\u9970\u3001\u7EC6\u53D1\u9970\u3001\u65E0\u624B\u6367\u82B1\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("campus-female-star", "\u6821\u56ED\u5973\u795E\u84DD\u767D\u5957\u88C5", "female", ["campus"], ["\u6821\u56ED", "\u5B66\u751F", "\u6821\u82B1", "\u767D\u6708\u5149"], "\u6821\u56ED\u5973\u795E\uFF0C\u9752\u6625\u4F46\u4E0D\u5E7C\u7A1A\uFF0C\u84DD\u767D\u5E72\u51C0\u3001\u6709\u6BD4\u4F8B\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u886C\u886B\u5185\u5C42\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u8896\u53E3\u6574\u9F50",
    top: "\u6D45\u84DD\u77ED\u6B3E\u9488\u7EC7\u80CC\u5FC3\uFF0C\u7EC6\u9488\u7EC7\u7EB9\u7406\uFF0C\u957F\u5EA6\u5361\u5728\u9AD8\u8170",
    bottom: "\u6DF1\u84DD\u9AD8\u8170\u767E\u8936\u88D9\uFF0C\u88D9\u8936\u6E05\u695A\uFF0C\u88D9\u6446\u786C\u633A",
    outerwear: "\u767D\u84DD\u77ED\u6B3E\u68D2\u7403\u5916\u5957\uFF0C\u7F57\u7EB9\u8896\u53E3\uFF0C\u80A9\u7EBF\u81EA\u7136",
    legwear: "\u81EA\u7136\u80A4\u8272\u817F\u90E8\u6216\u767D\u8272\u4E2D\u7B52\u889C\uFF0C\u5E72\u51C0\u4F4E\u53CD\u5149",
    shoes: "\u767D\u8272\u677F\u978B\u6216\u5C0F\u76AE\u978B\uFF0C\u978B\u9762\u5E72\u51C0",
    accessory: "\u7EC6\u53D1\u5939\u3001\u5C0F\u8033\u9489\u3001\u6821\u56ED\u98CE\u7EC6\u9886\u7ED3\uFF0C\u65E0\u6821\u5FBD\u6587\u5B57"
  }, ["16-20", "21-28"]),
  capsule3("career-female-nurse-soft", "\u5973\u62A4\u58EB\u67D4\u767D\u5236\u670D\u5957\u88C5", "female", ["career", "modern"], ["\u62A4\u58EB", "\u533B\u751F", "\u6E29\u67D4", "\u5973\u4E3B"], "\u533B\u7597\u6E29\u67D4\u7EBF\uFF0C\u4EB2\u548C\u4F46\u4E0D\u5E73\u5EB8\uFF0C\u65E0\u53EF\u8BFB\u6587\u5B57\u3002", {
    inner: "\u6D45\u7C89\u767D\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u5706\u6DA6\uFF0C\u6750\u8D28\u54D1\u5149",
    top: "\u767D\u8272\u77ED\u8896\u62A4\u58EB\u4E0A\u8863\uFF0C\u8170\u7EBF\u5FAE\u6536\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u65E0\u6587\u5B57",
    bottom: "\u767D\u8272\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u5E72\u51C0\uFF0C\u884C\u52A8\u65B9\u4FBF",
    outerwear: "\u6D45\u7C89\u77ED\u6B3E\u9488\u7EC7\u5916\u5957\uFF0C\u67D4\u8F6F\u4F46\u4E0D\u677E\u57AE\uFF0C\u8896\u53E3\u7EB9\u7406\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u767D\u8272\u88E4\u7EBF",
    shoes: "\u767D\u8272\u8F6F\u5E95\u76AE\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u978B\u578B\u5E72\u51C0",
    accessory: "\u5C0F\u73CD\u73E0\u8033\u9489\u3001\u7B80\u6D01\u8155\u8868\u3001\u65E0\u59D3\u540D\u724C\u6587\u5B57"
  }, ["21-28", "29-38"]),
  capsule3("modern-female-dancer-stage", "\u821E\u53F0\u5973\u660E\u661F\u5B9A\u5236\u5957\u88C5", "female", ["modern"], ["\u5973\u660E\u661F", "\u821E\u8005", "\u540D\u5A9B", "\u5973\u53CD"], "\u821E\u53F0/\u5A31\u4E50\u5708\u5973\u89D2\u8272\uFF0C\u5F3A\u955C\u5934\u5438\u5F15\u529B\uFF0C\u95EA\u5149\u4F46\u8138\u4E0D\u6CB9\u3002", {
    inner: "\u9ED1\u8272\u5F39\u529B\u8D34\u8EAB\u5185\u5C42\uFF0C\u7EC6\u95EA\u7EA4\u7EF4\u4F4E\u53CD\u5149",
    top: "\u94F6\u9ED1\u77ED\u6B3E\u821E\u53F0\u4E0A\u88C5\uFF0C\u4EAE\u7247\u5BC6\u5EA6\u514B\u5236\uFF0C\u80A9\u90E8\u7ED3\u6784\u5229\u843D",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u77ED\u88D9\u88E4\uFF0C\u88D9\u6446\u4E0D\u4E71\u98DE\uFF0C\u8170\u7EBF\u660E\u786E",
    outerwear: "\u94F6\u8272\u77ED\u6B3E\u6D41\u82CF\u5916\u5957\uFF0C\u6D41\u82CF\u7EC6\u5BC6\uFF0C\u52A8\u4F5C\u65F6\u6709\u5C42\u6B21",
    legwear: "\u9ED1\u8272\u534A\u900F\u660E\u7EC6\u5BC6\u889C\u6750\uFF0C\u817F\u90E8\u7EBF\u6761\u6E05\u695A",
    shoes: "\u9ED1\u8272\u7EC6\u8DDF\u77ED\u9774\uFF0C\u978B\u9762\u54D1\u5149\uFF0C\u811A\u8E1D\u7EBF\u5229\u843D",
    accessory: "\u6C34\u94BB\u8033\u73AF\u3001\u7EC6\u9888\u94FE\u3001\u65E0Logo\u65E0\u821E\u53F0\u6587\u5B57"
  }, ["21-28", "29-38"]),
  capsule3("career-male-ceo-navy", "\u85CF\u84DD\u7537\u603B\u88C1\u9AD8\u5B9A\u5957\u88C5", "male", ["modern", "career"], ["\u9738\u603B", "\u603B\u88C1", "\u7537\u4E3B", "\u8C6A\u95E8"], "\u7537\u4E3B\u9738\u603B\u6807\u51C6\uFF0C\u4F46\u66F4\u8D35\u3001\u66F4\u5408\u8EAB\uFF0C\u907F\u514D\u8DEF\u4EBA\u897F\u88C5\u3002", {
    inner: "\u5976\u6CB9\u767D\u9AD8\u652F\u68C9\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u8896\u53E3\u7CBE\u51C6",
    top: "\u85CF\u84DD\u4FEE\u8EAB\u9A6C\u7532\uFF0C\u7F8A\u6BDB\u6750\u8D28\uFF0C\u80F8\u8170\u7EBF\u5229\u843D",
    bottom: "\u85CF\u84DD\u9AD8\u8170\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u817F\u957F\u6BD4\u4F8B\u660E\u663E",
    outerwear: "\u85CF\u84DD\u9AD8\u5B9A\u897F\u88C5\u5916\u5957\uFF0C\u8F7B\u57AB\u80A9\uFF0C\u8170\u8EAB\u6536\u7A84\uFF0C\u8896\u6263\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u5782\u5760\u548C\u88E4\u7EBF",
    shoes: "\u9ED1\u8272\u725B\u6D25\u76AE\u978B\uFF0C\u8F7B\u5FAE\u64E6\u4EAE\u4F46\u4E0D\u8FC7\u5EA6\u53CD\u5149",
    accessory: "\u51B7\u94F6\u8155\u8868\u3001\u9886\u5E26\u5939\u3001\u8896\u6263\uFF0C\u8D35\u4F46\u4E0D\u62A2\u8138"
  }, ["29-38", "39-50"]),
  capsule3("career-male-lawyer-charcoal", "\u70AD\u7070\u7537\u5F8B\u5E08\u5957\u88C5", "male", ["modern", "career"], ["\u5F8B\u5E08", "\u7537\u4E3B", "\u804C\u4E1A", "\u51B7\u9759"], "\u6CD5\u5EAD/\u5546\u52A1\u7537\u4E3B\uFF0C\u514B\u5236\u3001\u53EF\u4FE1\u3001\u6709\u538B\u8FEB\u3002", {
    inner: "\u51B7\u767D\u886C\u886B\uFF0C\u68C9\u5E9C\u7EF8\u6750\u8D28\uFF0C\u9886\u89D2\u950B\u5229",
    top: "\u70AD\u7070\u4FEE\u8EAB\u9A6C\u7532\uFF0C\u7EC6\u7F8A\u6BDB\uFF0C\u6263\u4F4D\u6E05\u695A",
    bottom: "\u70AD\u7070\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u9762\u6599\u5782\u5760",
    outerwear: "\u70AD\u7070\u53CC\u6392\u6263\u897F\u88C5\u5916\u5957\uFF0C\u80A9\u7EBF\u786C\u633A\uFF0C\u7FFB\u9886\u7A84",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u897F\u88E4\u6BD4\u4F8B",
    shoes: "\u9ED1\u8272\u5FB7\u6BD4\u76AE\u978B\uFF0C\u978B\u578B\u4FEE\u957F\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u9ED1\u8272\u7EC6\u9886\u5E26\u3001\u94F6\u8272\u8896\u6263\u3001\u7A84\u8155\u8868\uFF0C\u65E0\u5F8B\u6240\u6587\u5B57"
  }, ["29-38", "39-50"]),
  capsule3("career-male-doctor-white", "\u7537\u533B\u751F\u767D\u888D\u5957\u88C5", "male", ["modern", "career"], ["\u533B\u751F", "\u7537\u4E3B", "\u6E29\u67D4", "\u804C\u4E1A"], "\u533B\u751F\u7537\u4E3B\uFF0C\u5E72\u51C0\u53EF\u4FE1\uFF0C\u767D\u888D\u6709\u8D28\u611F\u3002", {
    inner: "\u6D45\u84DD\u886C\u886B\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u7EC6\u68C9\u54D1\u5149",
    top: "\u6DF1\u7070\u9488\u7EC7\u9A6C\u7532\u6216\u533B\u7597\u4E0A\u8863\uFF0C\u8D34\u5408\u80A9\u80CC",
    bottom: "\u6DF1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136",
    outerwear: "\u767D\u8272\u533B\u751F\u957F\u888D\uFF0C\u539A\u68C9\u6DF7\u7EBA\uFF0C\u95E8\u895F\u548C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u65E0\u53EF\u8BFB\u6587\u5B57",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u767D\u888D\u5C42\u6B21",
    shoes: "\u9ED1\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u5E72\u51C0\u4F4E\u53CD\u5149",
    accessory: "\u7B80\u6D01\u8155\u8868\u3001\u65E0\u59D3\u540D\u724C"
  }, ["29-38", "39-50"]),
  capsule3("career-male-police-tactical", "\u7537\u8B66\u6267\u52E4\u5957\u88C5", "male", ["modern", "career"], ["\u8B66\u5BDF", "\u5236\u670D", "\u786C\u6C49", "\u7537\u4E3B"], "\u6267\u6CD5\u7537\u6027\uFF0C\u80A9\u80CC\u6709\u529B\u91CF\uFF0C\u5236\u670D\u4E0D\u51FA\u73B0\u6587\u5B57\u3002", {
    inner: "\u9ED1\u8272\u8D34\u8EAB\u8BAD\u7EC3\u5185\u5C42\uFF0C\u5F39\u6027\u54D1\u5149\u6750\u8D28",
    top: "\u6DF1\u85CF\u84DD\u5236\u670D\u886C\u886B\uFF0C\u80A9\u90E8\u7ED3\u6784\u6E05\u695A\uFF0C\u65E0\u53EF\u8BFB\u6587\u5B57",
    bottom: "\u6DF1\u85CF\u84DD\u6218\u672F\u957F\u88E4\uFF0C\u819D\u90E8\u62FC\u63A5\uFF0C\u884C\u52A8\u611F\u5F3A",
    outerwear: "\u77ED\u6B3E\u6267\u52E4\u5939\u514B\uFF0C\u5236\u670D\u5E03\u633A\u62EC\uFF0C\u8170\u90E8\u6536\u7D27",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u6218\u672F\u88E4\u7ED3\u6784",
    shoes: "\u9ED1\u8272\u6267\u52E4\u77ED\u9774\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u978B\u5E95\u7ED3\u5B9E",
    accessory: "\u9ED1\u8272\u8170\u5E26\u3001\u91D1\u5C5E\u6263\u4EF6\u3001\u65E0\u6587\u5B57\u80A9\u7AE0\u7ED3\u6784"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("modern-male-bodyguard-black", "\u9ED1\u8863\u4FDD\u9556\u786C\u6C49\u5957\u88C5", "male", ["modern", "career"], ["\u4FDD\u9556", "\u786C\u6C49", "\u7537\u53CD", "\u7537\u4E3B"], "\u4FDD\u9556/\u6253\u624B/\u786C\u6C49\uFF0C\u80A9\u80CC\u539A\uFF0C\u9ED1\u8272\u4F46\u4E0D\u7CCA\u3002", {
    inner: "\u9ED1\u8272\u8D34\u8EAB\u5706\u9886\u5185\u642D\uFF0C\u68C9\u8D28\u5F39\u529B\uFF0C\u663E\u80A9\u80CC",
    top: "\u9ED1\u8272\u77ED\u8896\u6216\u957F\u8896\u6218\u672F\u4E0A\u8863\uFF0C\u80A9\u8896\u62FC\u63A5\u6E05\u695A",
    bottom: "\u9ED1\u8272\u5DE5\u88C5\u957F\u88E4\uFF0C\u53E3\u888B\u548C\u819D\u90E8\u7ED3\u6784\u660E\u786E",
    outerwear: "\u9ED1\u8272\u77ED\u6B3E\u6218\u672F\u5939\u514B\uFF0C\u80A9\u90E8\u633A\uFF0C\u62C9\u94FE\u4F4E\u53CD\u5149",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u5DE5\u88C5\u88E4\u548C\u817F\u90E8\u529B\u91CF",
    shoes: "\u9ED1\u8272\u539A\u5E95\u6218\u672F\u9774\uFF0C\u78E8\u7802\u76AE\u9769\uFF0C\u978B\u5E26\u6E05\u695A",
    accessory: "\u9ED1\u8272\u76AE\u5E26\u3001\u51B7\u94F6\u8155\u8868\u3001\u65E0\u6B66\u5668\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("modern-male-cyber-hacker", "\u8D5B\u535A\u9ED1\u5BA2\u673A\u80FD\u5957\u88C5", "male", ["modern", "career", "fantasy"], ["\u79D1\u5E7B", "\u8D5B\u535A", "\u9ED1\u5BA2", "\u5F02\u80FD", "\u7537\u4E3B"], "\u8FD1\u672A\u6765\u6280\u672F\u578B\u7537\u4E3B\uFF0C\u9ED1\u84DD\u673A\u80FD\uFF0C\u4E0D\u80FD\u51FA\u73B0\u5C4F\u5E55\u6587\u5B57\u3002", {
    inner: "\u6DF1\u7070\u8D34\u8EAB\u9AD8\u9886\u5185\u642D\uFF0C\u5F39\u6027\u7EC7\u7269\uFF0C\u4F4E\u53CD\u5149",
    top: "\u9ED1\u84DD\u673A\u80FD\u77ED\u4E0A\u88C5\uFF0C\u62FC\u63A5\u7ED3\u6784\uFF0C\u62C9\u94FE\u548C\u538B\u80F6\u7EBF\u6E05\u695A",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u673A\u80FD\u957F\u88E4\uFF0C\u591A\u5C42\u53E3\u888B\u4F46\u65E0\u6587\u5B57",
    outerwear: "\u6DF1\u84DD\u77ED\u6B3E\u79D1\u6280\u5916\u5957\uFF0C\u54D1\u5149\u9632\u6C34\u6750\u8D28\uFF0C\u51B7\u94F6\u6263\u4EF6",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u673A\u80FD\u88E4\u7ED3\u6784",
    shoes: "\u9ED1\u8272\u539A\u5E95\u8FD0\u52A8\u9774\uFF0C\u672A\u6765\u611F\u978B\u5E95\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u51B7\u94F6\u8033\u6263\u3001\u65E0\u6587\u5B57\u8155\u5E26\u3001\u51E0\u4F55\u8170\u6263"
  }, ["16-20", "21-28", "29-38"]),
  capsule3("campus-male-clean", "\u6821\u56ED\u7537\u795E\u84DD\u767D\u5957\u88C5", "male", ["campus"], ["\u6821\u56ED", "\u5B66\u751F", "\u5B66\u9738", "\u7537\u4E3B"], "\u6821\u56ED\u7537\u4E3B\uFF0C\u6E05\u723D\u3001\u5E72\u51C0\u3001\u817F\u957F\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28T\u6064\u6216\u886C\u886B\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u6750\u8D28\u54D1\u5149",
    top: "\u6D45\u84DD\u9488\u7EC7\u80CC\u5FC3\u6216\u767D\u8272\u886C\u886B\u4E0A\u88C5\uFF0C\u80A9\u7EBF\u81EA\u7136",
    bottom: "\u6DF1\u84DD\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u5E72\u51C0\uFF0C\u6BD4\u4F8B\u4FEE\u957F",
    outerwear: "\u84DD\u767D\u77ED\u6B3E\u68D2\u7403\u5916\u5957\uFF0C\u7F57\u7EB9\u8896\u53E3\uFF0C\u9752\u6625\u4F46\u6709\u8D28\u611F",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u7EBF\u6761",
    shoes: "\u767D\u8272\u5E72\u51C0\u7403\u978B\uFF0C\u978B\u578B\u4FEE\u957F",
    accessory: "\u7EC6\u9ED1\u8155\u8868\u3001\u6781\u7B80\u8033\u9489\u53EF\u9009\u3001\u65E0\u6821\u5FBD\u6587\u5B57"
  }, ["16-20", "21-28"]),
  capsule3("modern-male-groom-formal", "\u77ED\u5267\u65B0\u90CE\u9ED1\u767D\u793C\u670D", "male", ["modern", "rural"], ["\u65B0\u90CE", "\u5A5A\u793C", "\u65B0\u90CE\u793C\u670D", "\u793C\u670D", "\u9738\u603B", "\u7537\u4E3B"], "\u5A5A\u793C/\u66FF\u5AC1\u7537\u4E3B\uFF0C\u9ED1\u767D\u793C\u670D\u3001\u5F3A\u80A9\u7EBF\u3002", {
    inner: "\u767D\u8272\u793C\u670D\u886C\u886B\uFF0C\u80F8\u524D\u7EC6\u8936\uFF0C\u9886\u53E3\u633A\u62EC",
    top: "\u9ED1\u8272\u793C\u670D\u9A6C\u7532\uFF0C\u7F0E\u9762\u8FB9\u7F18\uFF0C\u8170\u90E8\u6536\u7A84",
    bottom: "\u9ED1\u8272\u793C\u670D\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u5782\u5760\u597D",
    outerwear: "\u9ED1\u8272\u793C\u670D\u897F\u88C5\u5916\u5957\uFF0C\u7F0E\u9762\u7FFB\u9886\uFF0C\u80A9\u7EBF\u786C\u633A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u793C\u670D\u88E4\u7EBF",
    shoes: "\u9ED1\u8272\u6F06\u76AE\u793C\u978B\uFF0C\u53CD\u5149\u514B\u5236",
    accessory: "\u9ED1\u8272\u9886\u7ED3\u3001\u94F6\u8272\u8896\u6263\u3001\u65E0\u80F8\u82B1\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("modern-male-banquet-formal-suit", "\u73B0\u4EE3\u7537\u6027\u5BB4\u4F1A\u6B63\u88C5\u5957\u88C5", "male", ["modern", "career", "rural"], ["\u7537\u4E3B", "\u8C6A\u95E8", "\u540D\u6D41", "\u804C\u4E1A", "\u5BB4\u4F1A", "\u665A\u5BB4", "\u6B63\u88C5"], "\u73B0\u4EE3\u7537\u6027\u665A\u5BB4/\u5BB4\u4F1A\u6B63\u88C5\uFF0C\u4F5C\u4E3A\u6B63\u5F0F\u793E\u4EA4\u573A\u5408\u7684\u53EF\u590D\u7528\u670D\u88C5\u72B6\u6001\uFF0C\u4E0D\u9650\u5B9A\u7279\u5B9A\u8EAB\u4EFD\u3002", {
    inner: "\u767D\u8272\u9AD8\u652F\u68C9\u793C\u670D\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u80F8\u524D\u5E73\u6574\u65E0\u6587\u5B57",
    top: "\u6DF1\u70AD\u7070\u4FEE\u8EAB\u5355\u6392\u6263\u897F\u88C5\u4E0A\u5C42\uFF0C\u8170\u7EBF\u6536\u7A84\uFF0C\u80A9\u80F8\u6BD4\u4F8B\u6E05\u695A",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u793C\u670D\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u5782\u5760\u597D",
    outerwear: "\u9ED1\u8272\u77ED\u6B3E\u6B63\u88C5\u897F\u88C5\u5916\u5957\uFF0C\u7F0E\u9762\u7A84\u7FFB\u9886\uFF0C\u80A9\u7EBF\u786C\u633A\u4F46\u4E0D\u8FC7\u5EA6\u65B0\u90CE\u5316",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u793C\u670D\u88E4\u7EBF\u548C\u957F\u817F\u6BD4\u4F8B",
    shoes: "\u9ED1\u8272\u54D1\u5149\u6B63\u88C5\u76AE\u978B\uFF0C\u978B\u9762\u5E72\u51C0\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u6DF1\u8272\u9886\u5E26\u3001\u94F6\u8272\u8896\u6263\u3001\u65E0\u80F8\u82B1\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50", "51-65"]),
  capsule3("modern-male-mechanic-workwear", "\u6C7D\u4FEE\u5DE5\u88C5\u7537\u4E3B\u5957\u88C5", "male", ["modern", "rural"], ["\u5DE5\u4EBA", "\u6C7D\u4FEE", "\u786C\u6C49", "\u5E95\u5C42\u7537\u4E3B"], "\u5E95\u5C42\u9006\u88AD/\u6C7D\u4FEE\u7537\u4E3B\uFF0C\u7C97\u7C9D\u4F46\u5E05\uFF0C\u6709\u8EAB\u6750\u3002", {
    inner: "\u767D\u8272\u8D34\u8EAB\u80CC\u5FC3\uFF0C\u68C9\u8D28\u54D1\u5149\uFF0C\u9732\u51FA\u80A9\u81C2\u7EBF\u6761",
    top: "\u6DF1\u7070\u5DE5\u88C5\u886C\u886B\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u659C\u7EB9\u5E03\u6709\u78E8\u635F",
    bottom: "\u9ED1\u8272\u5DE5\u88C5\u957F\u88E4\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u819D\u90E8\u8F7B\u5FAE\u78E8\u635F",
    outerwear: "\u68D5\u9ED1\u77ED\u6B3E\u5DE5\u88C5\u5939\u514B\uFF0C\u5E06\u5E03\u548C\u78E8\u7802\u76AE\u62FC\u63A5",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u5DE5\u88C5\u88E4\u548C\u529B\u91CF\u611F",
    shoes: "\u68D5\u8272\u5DE5\u88C5\u77ED\u9774\uFF0C\u78E8\u7802\u76AE\u9769\uFF0C\u978B\u5934\u7ED3\u5B9E",
    accessory: "\u65E7\u76AE\u5E26\u3001\u91D1\u5C5E\u8155\u8868\u3001\u65E0\u5DE5\u5177\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("modern-male-detective-trench", "\u4FA6\u63A2\u957F\u98CE\u8863\u5957\u88C5", "male", ["modern", "republican", "career"], ["\u4FA6\u63A2", "\u5F8B\u5E08", "\u7537\u4E3B", "\u60AC\u7591"], "\u60AC\u7591\u7537\u4E3B\uFF0C\u98CE\u8863\u3001\u5C42\u6B21\u3001\u51B7\u8272\u3002", {
    inner: "\u51B7\u767D\u886C\u886B\uFF0C\u9886\u53E3\u5FAE\u677E\uFF0C\u68C9\u5E9C\u7EF8\u54D1\u5149",
    top: "\u6DF1\u7070\u9488\u7EC7\u9A6C\u7532\uFF0C\u7EC6\u9488\u7EC7\u7EB9\u7406\uFF0C\u8D34\u5408\u80F8\u8170",
    bottom: "\u9ED1\u8272\u76F4\u7B52\u897F\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A",
    outerwear: "\u5361\u5176\u6216\u6DF1\u7070\u957F\u98CE\u8863\uFF0C\u80A9\u88A2\u548C\u8170\u5E26\u7ED3\u6784\u6E05\u695A\uFF0C\u8863\u6446\u5782\u5760",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u98CE\u8863\u5C42\u6B21",
    shoes: "\u9ED1\u8272\u77ED\u9774\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u978B\u53E3\u5229\u843D",
    accessory: "\u7EC6\u9886\u5E26\u3001\u65E7\u94F6\u8155\u8868\u3001\u65E0\u70DF\u65E0\u624B\u6301\u9053\u5177"
  }, ["29-38", "39-50"]),
  capsule3("ancient-male-prince-white-gold", "\u767D\u91D1\u738B\u7237\u957F\u888D", "male", ["ancient"], ["\u738B\u7237", "\u7687\u5B50", "\u7537\u4E3B", "\u6743\u81E3"], "\u53E4\u88C5\u8D35\u516C\u5B50/\u738B\u7237\uFF0C\u767D\u91D1\u3001\u8170\u5C01\u3001\u6E05\u8D35\u3002", {
    inner: "\u51B7\u767D\u4E1D\u8D28\u4EA4\u9886\u5185\u888D\uFF0C\u6697\u7EB9\u7EC6\u5BC6\uFF0C\u9886\u53E3\u5C42\u6B21\u6E05\u695A",
    top: "\u767D\u91D1\u7EC7\u9526\u4EA4\u9886\u4E0A\u5C42\uFF0C\u80A9\u80CC\u633A\uFF0C\u8896\u53E3\u94F6\u7EBF\u6EDA\u8FB9",
    bottom: "\u767D\u8272\u957F\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u987A\u76F4\uFF0C\u884C\u8D70\u5C42\u6B21\u6E05\u695A",
    outerwear: "\u6D45\u91D1\u8584\u7EB1\u5916\u888D\uFF0C\u94F6\u7EBF\u6697\u7EB9\uFF0C\u5BBD\u8170\u5C01\u660E\u786E\u6536\u4F4F\u6BD4\u4F8B",
    legwear: "\u53E4\u88C5\u957F\u9774\u7ED3\u6784\u88AB\u888D\u6446\u534A\u906E\uFF0C\u817F\u90E8\u6BD4\u4F8B\u4ECD\u6E05\u695A",
    shoes: "\u767D\u8272\u6216\u6D45\u91D1\u53E4\u88C5\u957F\u9774\uFF0C\u9774\u7B52\u633A\u62EC\uFF0C\u6697\u7EB9\u8FB9\u7F18",
    accessory: "\u7389\u4F69\u3001\u94F6\u51A0\u3001\u8170\u5C01\u5782\u9970\uFF0C\u6750\u8D28\u6E05\u695A\uFF0C\u4E0D\u624B\u6301\u6247\u5B50"
  }, ["21-28", "29-38"]),
  capsule3("ancient-male-general-black-red", "\u9ED1\u7EA2\u5C06\u519B\u6218\u888D", "male", ["ancient"], ["\u5C06\u519B", "\u6B66\u5C06", "\u7537\u4E3B", "\u786C\u6C49"], "\u53E4\u4EE3\u5C06\u519B\uFF0C\u9ED1\u7EA2\u3001\u62A4\u80A9\u3001\u6218\u6597\u8EAB\u4EFD\u3002", {
    inner: "\u6DF1\u7070\u4EA4\u9886\u5185\u888D\uFF0C\u539A\u7EC7\u7269\uFF0C\u9886\u53E3\u5E73\u6574",
    top: "\u9ED1\u8272\u77ED\u7532\u5F0F\u4E0A\u5C42\uFF0C\u76AE\u9769\u548C\u7EC7\u9526\u62FC\u63A5\uFF0C\u80A9\u80F8\u7ED3\u6784\u5F3A",
    bottom: "\u9ED1\u8272\u6218\u888D\u4E0B\u6446\uFF0C\u524D\u540E\u5F00\u8869\u4FBF\u4E8E\u884C\u52A8",
    outerwear: "\u6697\u7EA2\u62AB\u98CE\u5F0F\u5916\u5C42\uFF0C\u9ED1\u8272\u76AE\u9769\u62A4\u80A9\uFF0C\u91D1\u5C5E\u6263\u5E26\u6E05\u695A",
    legwear: "\u9ED1\u8272\u7ED1\u817F\u548C\u62A4\u817F\u7ED3\u6784\uFF0C\u76AE\u9769\u4E0E\u5E03\u9762\u5C42\u6B21\u6E05\u695A",
    shoes: "\u9ED1\u8272\u53E4\u88C5\u6218\u9774\uFF0C\u9774\u7B52\u786C\u633A\uFF0C\u6697\u91D1\u6263\u4EF6",
    accessory: "\u6697\u91D1\u62A4\u8155\u3001\u5BBD\u8170\u5C01\u3001\u65E0\u5175\u5668\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50"]),
  capsule3("ancient-male-scholar-ink", "\u58A8\u9752\u4E66\u751F\u957F\u886B", "male", ["ancient"], ["\u4E66\u751F", "\u8C0B\u58EB", "\u6743\u81E3", "\u7537\u4E3B"], "\u4E66\u751F/\u8C0B\u58EB\uFF0C\u6587\u6C14\u4F46\u4E0D\u5F31\uFF0C\u58A8\u9752\u6709\u5C42\u6B21\u3002", {
    inner: "\u6708\u767D\u4EA4\u9886\u5185\u886B\uFF0C\u68C9\u9EBB\u4E1D\u6DF7\u7EBA\uFF0C\u9886\u53E3\u5E72\u51C0",
    top: "\u58A8\u9752\u76F4\u9886\u957F\u886B\u4E0A\u5C42\uFF0C\u6697\u7EB9\u7EC6\u5BC6\uFF0C\u80A9\u7EBF\u81EA\u7136",
    bottom: "\u58A8\u9752\u957F\u886B\u4E0B\u6446\uFF0C\u5782\u5760\u987A\u76F4\uFF0C\u6B65\u5E45\u5C42\u6B21\u6E05\u695A",
    outerwear: "\u6DF1\u9752\u8584\u5916\u888D\uFF0C\u7A84\u8896\uFF0C\u8170\u5C01\u4F4E\u8C03\u4F46\u660E\u786E",
    legwear: "\u65E0\u660E\u663E\u817F\u90E8\u6750\u8D28\uFF0C\u91CD\u70B9\u8868\u73B0\u888D\u6446\u5C42\u6B21",
    shoes: "\u9ED1\u8272\u5E03\u9762\u53E4\u88C5\u978B\uFF0C\u978B\u5934\u5E72\u51C0",
    accessory: "\u7389\u8272\u8170\u4F69\u3001\u7EC6\u53D1\u51A0\u3001\u65E0\u4E66\u5377\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("ancient-male-emperor-dark-gold", "\u7384\u91D1\u5E1D\u738B\u671D\u670D", "male", ["ancient"], ["\u7687\u5E1D", "\u5BB6\u4E3B", "\u6743\u529B", "\u7537\u53CD"], "\u5E1D\u738B/\u6743\u529B\u7537\u53CD\uFF0C\u7384\u91D1\u4F46\u4E0D\u5806\u6587\u5B57\u7EB9\u6837\u3002", {
    inner: "\u9ED1\u8272\u4E1D\u8D28\u5185\u888D\uFF0C\u9886\u53E3\u6697\u91D1\u6EDA\u8FB9",
    top: "\u7384\u91D1\u4EA4\u9886\u671D\u670D\u4E0A\u5C42\uFF0C\u539A\u7EC7\u9526\uFF0C\u80A9\u80CC\u633A\u62D4",
    bottom: "\u9ED1\u91D1\u957F\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u539A\u91CD\uFF0C\u7EB9\u6837\u4E0D\u53EF\u8BFB",
    outerwear: "\u6DF1\u9ED1\u5BBD\u8896\u5916\u888D\uFF0C\u6697\u91D1\u7EB9\u8DEF\u548C\u786C\u633A\u8170\u5C01\uFF0C\u538B\u8FEB\u611F\u5F3A",
    legwear: "\u65E0\u660E\u663E\u817F\u90E8\u6750\u8D28\uFF0C\u91CD\u70B9\u8868\u73B0\u539A\u91CD\u888D\u6446",
    shoes: "\u9ED1\u8272\u9AD8\u7B52\u671D\u9774\uFF0C\u6697\u91D1\u8FB9\u7F18\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u9ED1\u91D1\u53D1\u51A0\u3001\u7389\u4F69\u3001\u62A4\u8155\uFF0C\u7EB9\u8DEF\u4E0D\u53EF\u8BFB"
  }, ["29-38", "39-50", "51-65"]),
  capsule3("ancient-male-guard-navy", "\u6DF1\u84DD\u4F8D\u536B\u52B2\u88C5", "male", ["ancient"], ["\u4F8D\u536B", "\u4FDD\u9556", "\u6B66\u4FA0", "\u7537\u4E3B"], "\u53E4\u88C5\u4F8D\u536B/\u6B66\u4FA0\uFF0C\u884C\u52A8\u611F\u5F3A\uFF0C\u6DF1\u84DD\u4E0D\u7CCA\u3002", {
    inner: "\u9ED1\u8272\u7A84\u8896\u5185\u5C42\uFF0C\u54D1\u5149\u5E03\u9762\uFF0C\u8D34\u5408\u624B\u81C2",
    top: "\u6DF1\u84DD\u4EA4\u9886\u52B2\u88C5\u4E0A\u5C42\uFF0C\u659C\u895F\u7ED3\u6784\uFF0C\u80A9\u80F8\u5229\u843D",
    bottom: "\u6DF1\u84DD\u675F\u811A\u957F\u88E4\uFF0C\u819D\u90E8\u6709\u5E03\u9762\u5C42\u6B21",
    outerwear: "\u77ED\u6B3E\u9ED1\u84DD\u62A4\u80A9\u5916\u5C42\uFF0C\u76AE\u9769\u8FB9\u548C\u5E03\u9762\u62FC\u63A5",
    legwear: "\u9ED1\u8272\u7ED1\u817F\uFF0C\u5E03\u5E26\u5C42\u6B21\u6E05\u695A",
    shoes: "\u9ED1\u8272\u53E4\u88C5\u77ED\u9774\uFF0C\u978B\u5E95\u7ED3\u5B9E",
    accessory: "\u5BBD\u8170\u5E26\u3001\u62A4\u8155\u3001\u65E0\u5200\u5251\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("ancient-male-attendant-gray-blue", "\u7070\u84DD\u4E39\u9601\u4EC6\u4ECE\u888D", "male", ["ancient", "xianxia", "fantasy"], ["\u4EC6\u4ECE", "\u4F8D\u4ECE", "\u968F\u4ECE", "\u6742\u5F79", "\u4E39\u9601", "\u666E\u901A"], "\u53E4\u88C5\u4EC6\u4ECE/\u4E39\u9601\u6742\u5F79\uFF0C\u6734\u7D20\u4F46\u6709\u95E8\u6D3E\u8D28\u611F\u3002", {
    inner: "\u6D45\u7070\u4EA4\u9886\u5185\u888D\uFF0C\u68C9\u9EBB\u4E1D\u6DF7\u7EBA\uFF0C\u9886\u53E3\u5E72\u51C0",
    top: "\u7070\u84DD\u7A84\u8896\u4E0A\u888D\uFF0C\u5E03\u9762\u7EC6\u5BC6\uFF0C\u80A9\u7EBF\u81EA\u7136\u4F46\u4E0D\u677E\u57AE",
    bottom: "\u6DF1\u7070\u675F\u811A\u957F\u88E4\u6216\u888D\u6446\u4E0B\u5C42\uFF0C\u884C\u52A8\u65B9\u4FBF\uFF0C\u5C42\u6B21\u6E05\u695A",
    outerwear: "\u7070\u84DD\u77ED\u5916\u888D\uFF0C\u8170\u90E8\u7528\u5E03\u5E26\u6536\u7D27\uFF0C\u8863\u6446\u5E72\u51C0\u5229\u843D",
    legwear: "\u6DF1\u7070\u7ED1\u817F\uFF0C\u5E03\u5E26\u5C42\u6B21\u6E05\u695A\uFF0C\u9002\u5408\u8DD1\u817F\u6742\u5F79\u8EAB\u4EFD",
    shoes: "\u9ED1\u7070\u5E03\u9762\u77ED\u9774\uFF0C\u978B\u5E95\u7ED3\u5B9E\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u7D20\u8272\u8170\u5E26\u3001\u6728\u8D28\u5C0F\u8170\u724C\u3001\u65E0\u6258\u76D8\u65E0\u624B\u6301\u7269"
  }, ["16-20", "21-28", "29-38", "39-50"]),
  capsule3("ancient-female-princess-pearl", "\u73CD\u73E0\u767D\u516C\u4E3B\u5BAB\u88C5", "female", ["ancient"], ["\u516C\u4E3B", "\u8D35\u5973", "\u5973\u4E3B", "\u767D\u6708\u5149"], "\u53E4\u88C5\u516C\u4E3B/\u8D35\u5973\uFF0C\u73CD\u73E0\u767D\u3001\u8170\u5C01\u3001\u4ED9\u6C14\u4F46\u6709\u8EAB\u6750\u3002", {
    inner: "\u73CD\u73E0\u767D\u4E1D\u8D28\u5185\u88D9\uFF0C\u9886\u53E3\u7EC6\u817B\uFF0C\u67D4\u5149\u5782\u5760",
    top: "\u6D45\u7C89\u767D\u4EA4\u9886\u4E0A\u5C42\uFF0C\u8584\u7EB1\u548C\u4E1D\u7F0E\u53E0\u52A0\uFF0C\u80A9\u9888\u7EBF\u6E05\u695A",
    bottom: "\u73CD\u73E0\u767D\u9AD8\u8170\u957F\u88D9\uFF0C\u88D9\u8936\u7EC6\u5BC6\uFF0C\u8170\u7EBF\u9AD8",
    outerwear: "\u6D45\u7C89\u8584\u7EB1\u62AB\u5E1B\u5916\u5C42\uFF0C\u8FB9\u7F18\u73E0\u7EE3\uFF0C\u4E0D\u906E\u8170\u7EBF",
    legwear: "\u88D9\u6446\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u9AD8\u8170\u6BD4\u4F8B\u548C\u5782\u5760",
    shoes: "\u6D45\u7C89\u7EE3\u978B\uFF0C\u978B\u9762\u7EC6\u5BC6\u4E1D\u7EBF\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u73CD\u73E0\u53D1\u9970\u3001\u7389\u8272\u8033\u5760\u3001\u7EC6\u8170\u4F69\uFF0C\u4E0D\u624B\u6301\u56E2\u6247"
  }, ["16-20", "21-28"]),
  capsule3("ancient-female-queen-crimson", "\u6DF1\u7EA2\u7687\u540E\u5BAB\u88C5", "female", ["ancient"], ["\u7687\u540E", "\u5973\u53CD", "\u8D35\u5987", "\u6743\u529B"], "\u53E4\u88C5\u5973\u53CD/\u7687\u540E\uFF0C\u6DF1\u7EA2\u7384\u91D1\u3001\u538B\u8FEB\u4F46\u7F8E\u3002", {
    inner: "\u9ED1\u8272\u4E1D\u7F0E\u5185\u5C42\uFF0C\u9886\u53E3\u6697\u91D1\u6EDA\u8FB9",
    top: "\u6DF1\u7EA2\u7EC7\u9526\u4EA4\u9886\u4E0A\u5C42\uFF0C\u80A9\u90E8\u786C\u633A\uFF0C\u80F8\u8170\u7ED3\u6784\u6E05\u695A",
    bottom: "\u6DF1\u7EA2\u9AD8\u8170\u957F\u88D9\uFF0C\u539A\u7EC7\u9526\u6750\u8D28\uFF0C\u88D9\u6446\u6709\u91CD\u91CF",
    outerwear: "\u7384\u91D1\u5BBD\u8896\u5BAB\u88C5\u5916\u5C42\uFF0C\u6697\u91D1\u7EB9\u6837\u4E0D\u53EF\u8BFB\uFF0C\u5BBD\u8170\u5C01\u6536\u7D27",
    legwear: "\u88D9\u6446\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u539A\u91CD\u5BAB\u88C5\u8F6E\u5ED3",
    shoes: "\u9ED1\u91D1\u7EE3\u978B\uFF0C\u978B\u9762\u4F4E\u53CD\u5149\uFF0C\u8FB9\u7F18\u6697\u91D1",
    accessory: "\u91D1\u8272\u53D1\u51A0\u3001\u7EA2\u5B9D\u77F3\u8033\u5760\u3001\u62A4\u7532\u5F0F\u6212\u6307\u4F46\u4E0D\u5938\u5F20"
  }, ["29-38", "39-50"]),
  capsule3("ancient-female-assassin-black", "\u9ED1\u8863\u5973\u523A\u5BA2\u52B2\u88C5", "female", ["ancient", "xianxia"], ["\u523A\u5BA2", "\u5973\u4FA0", "\u5973\u53CD", "\u6740\u624B"], "\u53E4\u88C5\u5973\u523A\u5BA2\uFF0C\u9ED1\u8272\u884C\u52A8\u88C5\uFF0C\u8170\u817F\u6BD4\u4F8B\u8981\u597D\u3002", {
    inner: "\u9ED1\u8272\u8D34\u8EAB\u7A84\u8896\u5185\u5C42\uFF0C\u5F39\u6027\u7EC7\u7269\uFF0C\u4F4E\u53CD\u5149",
    top: "\u9ED1\u8272\u659C\u895F\u77ED\u4E0A\u88C5\uFF0C\u76AE\u9769\u8FB9\u548C\u5E03\u9762\u62FC\u63A5\uFF0C\u8170\u90E8\u6536\u7D27",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u884C\u52A8\u88D9\u88E4\uFF0C\u5916\u5C42\u77ED\u6218\u88D9\u548C\u4FA7\u5F00\u8869\u88D9\u6446\u8986\u76D6\uFF0C\u5185\u5C42\u675F\u811A\u88E4\u53EA\u4F5C\u4E3A\u884C\u52A8\u7ED3\u6784",
    outerwear: "\u77ED\u6B3E\u9ED1\u8272\u62AB\u80A9\u62A4\u80A9\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u80A9\u80CC\u7EBF\u6E05\u695A",
    legwear: "\u9ED1\u8272\u7ED1\u817F\u88AB\u88D9\u6446\u534A\u906E\uFF0C\u5E03\u5E26\u548C\u76AE\u9769\u5C42\u6B21\u6E05\u695A",
    shoes: "\u9ED1\u8272\u8F6F\u5E95\u77ED\u9774\uFF0C\u884C\u52A8\u611F\u5F3A\uFF0C\u978B\u53E3\u5229\u843D",
    accessory: "\u9ED1\u94F6\u62A4\u8155\u3001\u7EC6\u8170\u5E26\u3001\u65E0\u6B66\u5668\u65E0\u9762\u7F69\u6587\u5B57"
  }, ["21-28", "29-38"]),
  capsule3("ancient-female-courtesan-green", "\u9752\u7EFF\u82B1\u9B41\u534E\u670D", "female", ["ancient"], ["\u82B1\u9B41", "\u540D\u5A9B", "\u5973\u53CD", "\u7F8E\u4EBA"], "\u53E4\u88C5\u82B1\u9B41/\u540D\u4F36\uFF0C\u9752\u7EFF\u91D1\uFF0C\u534E\u4E3D\u4F46\u4E0D\u4FD7\u3002", {
    inner: "\u8C61\u7259\u767D\u4E1D\u8D28\u5185\u88D9\uFF0C\u9886\u53E3\u7EC6\u8936\uFF0C\u67D4\u5149\u6750\u8D28",
    top: "\u9752\u7EFF\u4EA4\u9886\u4E0A\u5C42\uFF0C\u7EC7\u9526\u6697\u7EB9\uFF0C\u80F8\u8170\u6BD4\u4F8B\u6E05\u695A",
    bottom: "\u9752\u7EFF\u9AD8\u8170\u957F\u88D9\uFF0C\u88D9\u8936\u591A\u5C42\uFF0C\u91D1\u7EBF\u8FB9\u7F18",
    outerwear: "\u58A8\u7EFF\u8584\u7EB1\u5916\u62AB\uFF0C\u91D1\u7EBF\u6EDA\u8FB9\uFF0C\u8896\u6446\u8F7B\u76C8",
    legwear: "\u88D9\u6446\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u8170\u7EBF\u548C\u88D9\u6446\u5C42\u6B21",
    shoes: "\u58A8\u7EFF\u7EE3\u978B\uFF0C\u91D1\u7EBF\u7EC6\u8282\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u91D1\u8272\u6B65\u6447\u3001\u7FE1\u7FE0\u8033\u5760\u3001\u7EC6\u8170\u4F69\uFF0C\u4E0D\u624B\u6301\u4E50\u5668"
  }, ["21-28", "29-38"]),
  capsule3("ancient-female-maid-clean", "\u53E4\u88C5\u4F8D\u5973\u6E05\u723D\u88C5", "female", ["ancient"], ["\u4F8D\u5973", "\u4E2B\u9B1F", "\u5973\u914D", "\u666E\u901A"], "\u53E4\u88C5\u4F8D\u5973/\u4E2B\u9B1F\uFF0C\u6734\u7D20\u4F46\u8981\u597D\u770B\u3001\u6709\u8FA8\u8BC6\u3002", {
    inner: "\u6D45\u7C73\u4EA4\u9886\u5185\u886B\uFF0C\u68C9\u9EBB\u4E1D\u6DF7\u7EBA\uFF0C\u9886\u53E3\u5E72\u51C0",
    top: "\u6D45\u9752\u77ED\u4E0A\u8966\uFF0C\u5E03\u9762\u7EC6\u5BC6\uFF0C\u8170\u90E8\u81EA\u7136\u6536\u7D27",
    bottom: "\u6D45\u7070\u84DD\u9AD8\u8170\u957F\u88D9\uFF0C\u88D9\u8936\u6E05\u695A\uFF0C\u5782\u5760\u81EA\u7136",
    outerwear: "\u6D45\u9752\u77ED\u62AB\u5E1B\u6216\u65E0\u8896\u5916\u5C42\uFF0C\u8FB9\u7F18\u6EDA\u7EBF\u6E05\u695A",
    legwear: "\u88D9\u6446\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u5E72\u51C0\u88D9\u8936",
    shoes: "\u6D45\u8272\u5E03\u978B\uFF0C\u978B\u9762\u5E72\u51C0\uFF0C\u6709\u7EC6\u5C0F\u7EE3\u7EBF",
    accessory: "\u5C0F\u53D1\u7C2A\u3001\u5E03\u8D28\u8170\u5E26\u3001\u65E0\u6258\u76D8\u65E0\u624B\u6301\u7269"
  }, ["16-20", "21-28"]),
  capsule3("ancient-female-matron-brown", "\u68D5\u7070\u7BA1\u4E8B\u5B37\u5B37\u957F\u888D", "female", ["ancient", "xianxia", "fantasy"], ["\u5B37\u5B37", "\u5A46\u5B50", "\u7BA1\u4E8B", "\u957F\u8F88", "\u4EC6\u5987"], "\u53E4\u88C5\u5B37\u5B37/\u7BA1\u4E8B\u4EC6\u5987\uFF0C\u751F\u6D3B\u5316\u4F46\u4E0D\u73B0\u4EE3\u3002", {
    inner: "\u7C73\u7070\u4EA4\u9886\u5185\u886B\uFF0C\u68C9\u9EBB\u6750\u8D28\uFF0C\u9886\u53E3\u6574\u6D01",
    top: "\u68D5\u7070\u4EA4\u9886\u957F\u4E0A\u888D\uFF0C\u539A\u68C9\u9EBB\u5E03\u9762\uFF0C\u80A9\u80CC\u6709\u5E74\u9F84\u611F\u4F46\u4E0D\u584C",
    bottom: "\u6DF1\u8910\u957F\u88D9\u6216\u957F\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u539A\u5B9E\uFF0C\u884C\u52A8\u7A33\u91CD",
    outerwear: "\u6DF1\u68D5\u65E0\u8896\u6BD4\u7532\u5916\u5C42\uFF0C\u8FB9\u7F18\u6EDA\u7EBF\u6E05\u695A\uFF0C\u8170\u90E8\u7565\u6536",
    legwear: "\u88D9\u6446\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u539A\u5B9E\u888D\u6446\u548C\u7A33\u91CD\u4F53\u6001",
    shoes: "\u9ED1\u5E03\u5706\u53E3\u978B\uFF0C\u978B\u9762\u5E72\u51C0\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u6728\u7C2A\u3001\u7D20\u8272\u8170\u5E26\u3001\u65E0\u94A5\u5319\u4E32\u65E0\u624B\u6301\u7269"
  }, ["39-50", "51-65", "66-80"]),
  capsule3("xianxia-male-immortal-white", "\u767D\u91D1\u4ED9\u5C0A\u957F\u888D", "male", ["xianxia", "fantasy"], ["\u4ED9\u5C0A", "\u5E08\u5C0A", "\u7537\u4E3B", "\u767D\u53D1"], "\u4ED9\u4FA0\u7537\u4E3B/\u5E08\u5C0A\uFF0C\u767D\u91D1\u3001\u6E05\u8D35\u3001\u5F3A\u8005\u611F\u3002", {
    inner: "\u51B7\u767D\u4E1D\u8D28\u5185\u888D\uFF0C\u6697\u7EB9\u7EC6\u5BC6\uFF0C\u9886\u53E3\u5C42\u6B21\u6E05\u695A",
    top: "\u767D\u91D1\u4EA4\u9886\u4E0A\u5C42\uFF0C\u94F6\u7EBF\u6EDA\u8FB9\uFF0C\u80A9\u80CC\u633A\u62D4",
    bottom: "\u767D\u8272\u957F\u888D\u4E0B\u6446\uFF0C\u5782\u5760\u5E72\u51C0\uFF0C\u5C42\u6B21\u5206\u660E",
    outerwear: "\u534A\u900F\u660E\u767D\u7EB1\u5916\u888D\uFF0C\u6D45\u91D1\u8170\u5C01\uFF0C\u4ED9\u6C14\u4F46\u4E0D\u677E\u57AE",
    legwear: "\u767D\u8272\u53E4\u88C5\u957F\u9774\u7ED3\u6784\uFF0C\u888D\u6446\u534A\u906E\uFF0C\u6BD4\u4F8B\u6E05\u695A",
    shoes: "\u767D\u91D1\u957F\u9774\uFF0C\u9774\u7B52\u633A\u62EC\uFF0C\u94F6\u7EB9\u4E0D\u53EF\u8BFB",
    accessory: "\u94F6\u51A0\u3001\u7389\u4F69\u3001\u62A4\u8155\uFF0C\u4E0D\u80FD\u624B\u6301\u5251"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("xianxia-male-demon-black", "\u9ED1\u7D2B\u9B54\u5C0A\u957F\u888D", "male", ["xianxia", "fantasy"], ["\u9B54\u5C0A", "\u7537\u53CD", "\u7384\u5E7B", "\u9B54\u65CF"], "\u7384\u5E7B\u7537\u53CD/\u9B54\u5C0A\uFF0C\u9ED1\u7D2B\u3001\u6697\u91D1\u3001\u5371\u9669\u3002", {
    inner: "\u9ED1\u8272\u4E1D\u8D28\u5185\u888D\uFF0C\u6697\u7D2B\u9886\u53E3\uFF0C\u4F4E\u53CD\u5149",
    top: "\u9ED1\u7D2B\u4EA4\u9886\u4E0A\u5C42\uFF0C\u76AE\u9769\u548C\u7EC7\u9526\u62FC\u63A5\uFF0C\u80A9\u7EBF\u5F3A",
    bottom: "\u9ED1\u8272\u957F\u888D\u4E0B\u6446\uFF0C\u524D\u6446\u5F00\u8869\uFF0C\u884C\u8D70\u6709\u5C42\u6B21",
    outerwear: "\u6697\u7D2B\u957F\u5916\u888D\uFF0C\u9ED1\u66DC\u77F3\u6263\u4EF6\uFF0C\u6697\u91D1\u7EB9\u8DEF\u4E0D\u53EF\u8BFB",
    legwear: "\u9ED1\u8272\u62A4\u817F\u548C\u957F\u9774\u7ED3\u6784\uFF0C\u76AE\u9769\u5C42\u6B21\u6E05\u695A",
    shoes: "\u9ED1\u8272\u7384\u5E7B\u957F\u9774\uFF0C\u6697\u91D1\u91D1\u5C5E\u6263\uFF0C\u539A\u5E95\u4E0D\u7B28\u91CD",
    accessory: "\u9ED1\u66DC\u77F3\u8033\u9970\u3001\u6697\u91D1\u8170\u5C01\u3001\u62A4\u8155\uFF0C\u65E0\u6B66\u5668"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("xianxia-female-fairy-ice", "\u51B0\u84DD\u4ED9\u4FA0\u5973\u4E3B\u88D9\u88C5", "female", ["xianxia", "fantasy"], ["\u4ED9\u4FA0", "\u51B0\u7CFB", "\u5973\u4E3B", "\u767D\u6708\u5149"], "\u4ED9\u4FA0\u5973\u4E3B/\u51B0\u7CFB\u89D2\u8272\uFF0C\u51B0\u84DD\u94F6\u767D\uFF0C\u6E05\u51B7\u5438\u775B\u3002", {
    inner: "\u94F6\u767D\u4E1D\u8D28\u5185\u88D9\uFF0C\u67D4\u5149\u5782\u5760\uFF0C\u9886\u53E3\u5E72\u51C0",
    top: "\u51B0\u84DD\u4EA4\u9886\u4E0A\u5C42\uFF0C\u8584\u7EB1\u548C\u4E1D\u7F0E\u53E0\u52A0\uFF0C\u80A9\u9888\u7EBF\u6E05\u695A",
    bottom: "\u51B0\u84DD\u9AD8\u8170\u957F\u88D9\uFF0C\u88D9\u6446\u8F7B\u8584\uFF0C\u94F6\u7EBF\u8FB9\u7F18",
    outerwear: "\u900F\u660E\u51B0\u84DD\u5916\u7EB1\uFF0C\u94F6\u8272\u8170\u5C01\uFF0C\u4E0D\u80FD\u906E\u4F4F\u8EAB\u6750\u6BD4\u4F8B",
    legwear: "\u88D9\u6446\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u9AD8\u8170\u548C\u8F7B\u76C8\u5C42\u6B21",
    shoes: "\u94F6\u767D\u7EE3\u978B\u6216\u6D45\u8272\u957F\u9774\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u94F6\u8272\u53D1\u9970\u3001\u51B0\u84DD\u8033\u5760\u3001\u7389\u4F69\uFF0C\u4E0D\u624B\u6301\u6CD5\u5668"
  }, ["16-20", "21-28", "29-38"]),
  capsule3("fantasy-female-witch-black-red", "\u9ED1\u7EA2\u9B54\u5973\u77ED\u5267\u5957\u88C5", "female", ["fantasy", "xianxia"], ["\u9B54\u5973", "\u5973\u53CD", "\u7384\u5E7B", "\u53CD\u6D3E"], "\u9B54\u5973/\u7384\u5E7B\u5973\u53CD\uFF0C\u9ED1\u7EA2\u3001\u4FEE\u8EAB\u3001\u8BB0\u5FC6\u70B9\u5F3A\u3002", {
    inner: "\u9ED1\u8272\u8D34\u8EAB\u6697\u7EB9\u5185\u5C42\uFF0C\u5F39\u6027\u7EC7\u7269\uFF0C\u4F4E\u53CD\u5149",
    top: "\u9ED1\u7EA2\u7ED3\u6784\u77ED\u4E0A\u88C5\uFF0C\u76AE\u9769\u548C\u7EC7\u9526\u62FC\u63A5\uFF0C\u8170\u90E8\u6536\u7D27",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u4E0D\u5BF9\u79F0\u77ED\u88D9\uFF0C\u6697\u7EA2\u5185\u886C\uFF0C\u88D9\u6446\u5C42\u6B21\u6E05\u695A",
    outerwear: "\u9ED1\u7EA2\u77ED\u62AB\u98CE\u5916\u5C42\uFF0C\u6697\u91D1\u6263\u4EF6\uFF0C\u80A9\u90E8\u8F6E\u5ED3\u950B\u5229",
    legwear: "\u9ED1\u8272\u534A\u900F\u660E\u889C\u6750\u6216\u76AE\u9769\u62A4\u817F\uFF0C\u817F\u90E8\u7EBF\u6761\u6E05\u695A",
    shoes: "\u9ED1\u8272\u9AD8\u8DDF\u77ED\u9774\uFF0C\u6697\u7EA2\u8FB9\u7F18\uFF0C\u978B\u578B\u9510\u5229",
    accessory: "\u9ED1\u66DC\u77F3\u8033\u9970\u3001\u6697\u91D1\u8170\u94FE\u3001\u4E0D\u53EF\u8BFB\u7B26\u7EB9\u91D1\u5C5E\u4EF6"
  }, ["21-28", "29-38"]),
  capsule3("fantasy-female-warrior-silver", "\u94F6\u9ED1\u5973\u6218\u58EB\u8F7B\u7532", "female", ["fantasy", "xianxia"], ["\u5973\u6218\u58EB", "\u5973\u4FA0", "\u7384\u5E7B", "\u5973\u4E3B"], "\u7384\u5E7B\u5973\u6218\u58EB\uFF0C\u8F7B\u7532\u4E0D\u539A\u91CD\uFF0C\u4FDD\u7559\u8EAB\u6750\u3002", {
    inner: "\u9ED1\u8272\u8D34\u8EAB\u5185\u7532\uFF0C\u5F39\u6027\u7EC7\u7269\u548C\u76AE\u9769\u62FC\u63A5",
    top: "\u94F6\u9ED1\u8F7B\u7532\u4E0A\u88C5\uFF0C\u80F8\u80A9\u7ED3\u6784\u6E05\u695A\uFF0C\u8170\u90E8\u6536\u7D27",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u6218\u6597\u88D9\u88E4\uFF0C\u88D9\u7247\u548C\u77ED\u88E4\u5C42\u6B21\u5206\u660E",
    outerwear: "\u77ED\u6B3E\u94F6\u9ED1\u62A4\u80A9\u5916\u5C42\uFF0C\u91D1\u5C5E\u8FB9\u6263\uFF0C\u884C\u52A8\u611F\u5F3A",
    legwear: "\u9ED1\u8272\u76AE\u9769\u62A4\u817F\uFF0C\u94F6\u8272\u6263\u5E26\uFF0C\u7EBF\u6761\u5229\u843D",
    shoes: "\u9ED1\u8272\u7384\u5E7B\u77ED\u9774\uFF0C\u94F6\u8272\u6263\u4EF6\uFF0C\u978B\u5E95\u7A33\u5B9A",
    accessory: "\u94F6\u8272\u62A4\u8155\u3001\u7EC6\u8170\u5E26\u3001\u65E0\u5251\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("fantasy-male-mage-blue", "\u84DD\u94F6\u9B54\u6CD5\u5E08\u957F\u88C5", "male", ["fantasy"], ["\u9B54\u6CD5", "\u6CD5\u5E08", "\u7537\u4E3B", "\u7384\u5E7B"], "\u9B54\u6CD5\u7537\u4E3B\uFF0C\u84DD\u94F6\u3001\u5B66\u9662\u611F\u3001\u8D35\u65CF\u611F\u3002", {
    inner: "\u6DF1\u84DD\u9AD8\u9886\u5185\u5C42\uFF0C\u7EC6\u5BC6\u5F39\u6027\u7EC7\u7269\uFF0C\u4F4E\u53CD\u5149",
    top: "\u84DD\u94F6\u7ED3\u6784\u4E0A\u88C5\uFF0C\u659C\u895F\u548C\u91D1\u5C5E\u6263\u4EF6\u6E05\u695A",
    bottom: "\u9ED1\u84DD\u4FEE\u8EAB\u957F\u88E4\uFF0C\u88E4\u7EBF\u5E72\u51C0",
    outerwear: "\u6DF1\u84DD\u957F\u6B3E\u9B54\u6CD5\u5916\u5957\uFF0C\u94F6\u7EBF\u8FB9\u7F18\uFF0C\u4E0D\u53EF\u8BFB\u6697\u7EB9",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u4FEE\u8EAB\u957F\u88E4",
    shoes: "\u9ED1\u8272\u91D1\u5C5E\u6263\u77ED\u9774\uFF0C\u539A\u5E95\u4E0D\u7B28\u91CD",
    accessory: "\u94F6\u8272\u8033\u6263\u3001\u84DD\u5B9D\u77F3\u8170\u6263\u3001\u65E0\u9B54\u6756\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("fantasy-magic-academy-girl", "\u9B54\u6CD5\u5B66\u9662\u5C11\u5973\u5236\u670D", "female", ["fantasy", "campus"], ["\u9B54\u6CD5", "\u5B66\u9662", "\u5C11\u5973", "\u5973\u4E3B"], "\u9B54\u6CD5\u5B66\u9662\u5973\u4E3B\uFF0C\u6821\u670D\u611F\u4F46\u66F4\u7CBE\u81F4\u3002", {
    inner: "\u767D\u8272\u9AD8\u9886\u886C\u886B\uFF0C\u9886\u53E3\u5C0F\u8936\uFF0C\u68C9\u8D28\u54D1\u5149",
    top: "\u6DF1\u7D2B\u77ED\u6B3E\u5236\u670D\u4E0A\u88C5\uFF0C\u94F6\u8272\u6EDA\u8FB9\uFF0C\u80A9\u7EBF\u81EA\u7136",
    bottom: "\u6DF1\u7D2B\u9AD8\u8170\u767E\u8936\u77ED\u88D9\uFF0C\u88D9\u8936\u786C\u633A\uFF0C\u8170\u7EBF\u660E\u786E",
    outerwear: "\u9ED1\u7D2B\u77ED\u6597\u7BF7\u5916\u5C42\uFF0C\u94F6\u6263\u548C\u4E0D\u53EF\u8BFB\u6697\u7EB9",
    legwear: "\u9ED1\u8272\u534A\u900F\u660E\u889C\u6750\u6216\u6DF1\u8272\u4E2D\u7B52\u889C\uFF0C\u4F4E\u53CD\u5149",
    shoes: "\u9ED1\u8272\u5C0F\u76AE\u978B\uFF0C\u539A\u5E95\u8F7B\uFF0C\u978B\u578B\u5E72\u51C0",
    accessory: "\u94F6\u8272\u53D1\u5939\u3001\u661F\u5F62\u8033\u9489\u3001\u65E0\u6821\u5FBD\u6587\u5B57"
  }, ["16-20", "21-28"]),
  capsule3("fantasy-magic-academy-boy", "\u9B54\u6CD5\u5B66\u9662\u5C11\u5E74\u5236\u670D", "male", ["fantasy", "campus"], ["\u9B54\u6CD5", "\u5B66\u9662", "\u5C11\u5E74", "\u7537\u4E3B"], "\u9B54\u6CD5\u5B66\u9662\u7537\u4E3B\uFF0C\u6821\u670D\u611F\u3001\u4FEE\u957F\u3001\u8D35\u65CF\u3002", {
    inner: "\u767D\u8272\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u8896\u53E3\u5E72\u51C0",
    top: "\u9ED1\u84DD\u5236\u670D\u9A6C\u7532\uFF0C\u94F6\u7EBF\u6EDA\u8FB9\uFF0C\u8170\u8EAB\u5229\u843D",
    bottom: "\u9ED1\u8272\u4FEE\u8EAB\u957F\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A",
    outerwear: "\u6DF1\u84DD\u77ED\u6597\u7BF7\u5236\u670D\u5916\u5C42\uFF0C\u94F6\u6263\u548C\u4E0D\u53EF\u8BFB\u6697\u7EB9",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u6BD4\u4F8B",
    shoes: "\u9ED1\u8272\u5B66\u9662\u76AE\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u978B\u578B\u4FEE\u957F",
    accessory: "\u94F6\u8272\u9886\u9488\u3001\u7EC6\u8155\u5E26\u3001\u65E0\u6821\u5FBD\u6587\u5B57"
  }, ["16-20", "21-28"]),
  capsule3("rural-female-vitality-floral", "\u4E61\u6751\u5973\u4E3B\u751F\u547D\u529B\u5957\u88C5", "female", ["rural", "period"], ["\u4E61\u6751", "\u6751\u82B1", "\u5973\u4E3B", "\u5E74\u4EE3"], "\u4E61\u6751/\u5E74\u4EE3\u5973\u4E3B\uFF0C\u4E0D\u571F\u6C14\uFF0C\u6709\u751F\u547D\u529B\u548C\u6BD4\u4F8B\u3002", {
    inner: "\u767D\u8272\u68C9\u9EBB\u5185\u642D\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u5E03\u7EB9\u53EF\u89C1",
    top: "\u6D45\u84DD\u788E\u82B1\u6536\u8170\u886C\u886B\uFF0C\u68C9\u5E03\u6750\u8D28\uFF0C\u8896\u53E3\u81EA\u7136\u5377\u8D77",
    bottom: "\u6DF1\u84DD\u9AD8\u8170\u76F4\u7B52\u725B\u4ED4\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A\uFF0C\u817F\u90E8\u6BD4\u4F8B\u597D",
    outerwear: "\u6D45\u7C73\u77ED\u6B3E\u9488\u7EC7\u5F00\u886B\uFF0C\u54D1\u5149\u67D4\u8F6F\uFF0C\u957F\u5EA6\u5361\u8170",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u725B\u4ED4\u88E4\u7EBF\u6761",
    shoes: "\u5E72\u51C0\u5E06\u5E03\u978B\u6216\u6D45\u8272\u5E03\u978B\uFF0C\u8F7B\u5FAE\u751F\u6D3B\u78E8\u635F",
    accessory: "\u5E03\u8D28\u53D1\u5E26\u3001\u5C0F\u94F6\u8033\u9489\u3001\u65E7\u76AE\u5E26\uFF0C\u4E0D\u624B\u6301\u7BEE\u5B50"
  }, ["16-20", "21-28", "29-38"]),
  capsule3("rural-male-hardman-denim", "\u4E61\u6751\u786C\u6C49\u725B\u4ED4\u5DE5\u88C5", "male", ["rural", "period"], ["\u4E61\u6751", "\u786C\u6C49", "\u7537\u4E3B", "\u5DE5\u4EBA"], "\u4E61\u6751\u786C\u6C49/\u5E95\u5C42\u7537\u4E3B\uFF0C\u7C97\u7C9D\u4F46\u6709\u5438\u5F15\u529B\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u80CC\u5FC3\uFF0C\u54D1\u5149\uFF0C\u663E\u80A9\u81C2\u7EBF\u6761",
    top: "\u6DF1\u84DD\u725B\u4ED4\u886C\u886B\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u5E03\u6599\u6709\u8F7B\u5FAE\u78E8\u635F",
    bottom: "\u6DF1\u8272\u5DE5\u88C5\u957F\u88E4\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u88E4\u811A\u5229\u843D",
    outerwear: "\u68D5\u8272\u77ED\u6B3E\u5E06\u5E03\u5939\u514B\uFF0C\u78E8\u7802\u76AE\u8FB9\uFF0C\u80A9\u80CC\u633A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u5DE5\u88C5\u88E4\u548C\u9774\u5B50",
    shoes: "\u68D5\u8272\u5DE5\u88C5\u9774\uFF0C\u978B\u5934\u7ED3\u5B9E\uFF0C\u6709\u771F\u5B9E\u78E8\u635F",
    accessory: "\u65E7\u76AE\u5E26\u3001\u6734\u7D20\u8155\u8868\u3001\u65E0\u519C\u5177\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("period-female-factory-80s", "\u5E74\u4EE3\u5382\u82B1\u886C\u886B\u5957\u88C5", "female", ["period"], ["\u5E74\u4EE3", "\u5382\u82B1", "\u5973\u4E3B", "\u5DE5\u4EBA"], "\u516B\u4E5D\u5341\u5E74\u4EE3\u5382\u82B1\uFF0C\u6734\u7D20\u4F46\u6F02\u4EAE\u3001\u5E72\u51C0\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u6734\u7D20\uFF0C\u5E03\u6599\u771F\u5B9E",
    top: "\u6D45\u7C89\u683C\u7EB9\u886C\u886B\uFF0C\u68C9\u5E03\u6750\u8D28\uFF0C\u6536\u8170\u81EA\u7136",
    bottom: "\u6DF1\u84DD\u9AD8\u8170\u76F4\u7B52\u88E4\uFF0C\u88E4\u7EBF\u5E72\u51C0\uFF0C\u5E74\u4EE3\u611F\u660E\u786E",
    outerwear: "\u6D45\u7070\u77ED\u6B3E\u9488\u7EC7\u5F00\u886B\uFF0C\u8896\u53E3\u7EB9\u7406\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u76F4\u7B52\u88E4\u6BD4\u4F8B",
    shoes: "\u767D\u8272\u56DE\u529B\u611F\u7403\u978B\uFF0C\u65E0Logo\u6587\u5B57\uFF0C\u978B\u9762\u5E72\u51C0",
    accessory: "\u7EC6\u53D1\u5939\u3001\u65E7\u91D1\u5C5E\u8155\u8868\u3001\u5E03\u8D28\u8170\u5E26"
  }, ["16-20", "21-28", "29-38"]),
  capsule3("period-female-factory-worker-clean-blue", "\u5E74\u4EE3\u5DE5\u5382\u5973\u5DE5\u84DD\u5E03\u5DE5\u88C5", "female", ["period"], ["\u5DE5\u5382\u5973\u5DE5", "\u8F66\u95F4\u5973\u5DE5"], "\u516B\u4E5D\u5341\u5E74\u4EE3\u5DE5\u5382\u5973\u5DE5\uFF0C\u52B3\u52A8\u611F\u660E\u786E\u4F46\u4FDD\u6301\u5E72\u51C0\u3001\u6709\u8FA8\u8BC6\u5EA6\u3002", {
    inner: "\u767D\u8272\u68C9\u5E03\u5706\u9886\u5185\u642D\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u54D1\u5149\u5E03\u6599",
    top: "\u84DD\u5E03\u77ED\u8896\u5DE5\u88C5\u4E0A\u8863\uFF0C\u7EBD\u6263\u6E05\u695A\uFF0C\u80A9\u7EBF\u6734\u7D20\u5229\u843D",
    bottom: "\u76F4\u7B52\u52B3\u52A8\u5E03\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u819D\u90E8\u8F7B\u5FAE\u78E8\u635F",
    outerwear: "\u8584\u6B3E\u52B3\u52A8\u5E03\u5916\u5957\u642D\u5728\u4E0A\u5C42\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u76F4\u7B52\u88E4\u548C\u7AD9\u59FF",
    shoes: "\u4F4E\u5E2E\u5E03\u978B\uFF0C\u978B\u9762\u5E72\u51C0\u6709\u8F7B\u5FAE\u65E7\u611F\uFF0C\u65E0Logo\u6587\u5B57",
    accessory: "\u7EA2\u8272\u6216\u7D20\u8272\u53D1\u7EF3\u3001\u65E7\u8155\u8868\u3001\u65E0\u5DE5\u5177\u65E0\u624B\u6301\u7269"
  }, ["16-20", "21-28", "29-38"]),
  capsule3("period-female-factory-teamlead-navy", "\u5E74\u4EE3\u8F66\u95F4\u5973\u73ED\u957F\u5957\u88C5", "female", ["period"], ["\u5DE5\u5382\u73ED\u957F", "\u8F66\u95F4\u73ED\u957F", "\u5973\u73ED\u957F"], "\u8F66\u95F4\u5973\u73ED\u957F/\u9AA8\u5E72\u5973\u5DE5\uFF0C\u5E72\u7EC3\u3001\u6709\u7BA1\u7406\u611F\u4F46\u4ECD\u662F\u5E74\u4EE3\u5DE5\u5382\u73AF\u5883\u3002", {
    inner: "\u6D45\u8272\u68C9\u8D28\u886C\u886B\u5185\u5C42\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u5E03\u6599\u771F\u5B9E",
    top: "\u77ED\u6B3E\u5DE5\u88C5\u5939\u514B\u4E0A\u5C42\uFF0C\u80A9\u7EBF\u66F4\u5229\u843D\uFF0C\u80F8\u524D\u65E0\u6587\u5B57\u7F16\u53F7",
    bottom: "\u9AD8\u8170\u76F4\u7B52\u957F\u88E4\uFF0C\u8170\u7EBF\u6E05\u695A\uFF0C\u88E4\u811A\u5229\u843D",
    outerwear: "\u8584\u5462\u6216\u52B3\u52A8\u5E03\u77ED\u5916\u5957\uFF0C\u95E8\u895F\u548C\u8896\u53E3\u6574\u9F50",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u7A33\u91CD\u7AD9\u59FF",
    shoes: "\u9ED1\u8272\u4F4E\u8DDF\u5E03\u9762\u978B\uFF0C\u978B\u578B\u7A33\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u65E7\u94A2\u7B14\u522B\u5728\u53E3\u888B\u5185\u4FA7\u3001\u7B80\u6D01\u8155\u8868\u3001\u65E0\u624B\u6301\u6587\u4EF6"
  }, ["21-28", "29-38"]),
  capsule3("period-female-factory-office-cardigan", "\u5E74\u4EE3\u5382\u529E\u6587\u5458\u9488\u7EC7\u5957\u88C5", "female", ["period"], ["\u5DE5\u5382\u6587\u5458", "\u5382\u529E\u6587\u5458", "\u5382\u82B1"], "\u5382\u529E\u6587\u5458/\u5DE5\u5382\u529E\u516C\u5BA4\u5973\u9752\u5E74\uFF0C\u6BD4\u8F66\u95F4\u5973\u5DE5\u66F4\u6574\u6D01\u6E29\u548C\u3002", {
    inner: "\u7D20\u8272\u7FFB\u9886\u886C\u886B\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u5E03\u6599\u6709\u5E74\u4EE3\u611F",
    top: "\u77ED\u6B3E\u7EC6\u9488\u7EC7\u4E0A\u8863\uFF0C\u8D34\u5408\u80A9\u9888\uFF0C\u8170\u7EBF\u81EA\u7136",
    bottom: "\u9AD8\u8170\u76F4\u7B52\u88E4\u6216\u8FC7\u819D\u534A\u88D9\uFF0C\u7EBF\u6761\u7AEF\u6B63\u4E0D\u5938\u5F20",
    outerwear: "\u8F7B\u8584\u9488\u7EC7\u5F00\u886B\uFF0C\u95E8\u895F\u7EB9\u7406\u6E05\u695A\uFF0C\u8896\u53E3\u5E72\u51C0",
    legwear: "\u81EA\u7136\u80A4\u8272\u6216\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u7AEF\u6B63\u7AD9\u59FF",
    shoes: "\u6D45\u53E3\u5E03\u9762\u5C0F\u76AE\u978B\uFF0C\u978B\u5934\u5706\u6DA6\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u7EC6\u53D1\u5361\u3001\u65E7\u91D1\u5C5E\u8155\u8868\u3001\u65E0\u6587\u4EF6\u5939\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("period-female-textile-worker-apron", "\u5E74\u4EE3\u7EBA\u7EC7\u5973\u5DE5\u52B3\u52A8\u5E03\u5957\u88C5", "female", ["period"], ["\u7EBA\u7EC7\u5973\u5DE5", "\u5DE5\u5382\u5973\u5DE5", "\u8F66\u95F4\u5973\u5DE5"], "\u7EBA\u7EC7\u5382/\u8F7B\u5DE5\u4E1A\u5973\u5DE5\uFF0C\u52B3\u52A8\u5E03\u5C42\u6B21\u548C\u5E03\u6599\u7EB9\u7406\u66F4\u660E\u663E\u3002", {
    inner: "\u6D45\u8272\u68C9\u5E03\u886C\u886B\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u5E03\u7EB9\u53EF\u89C1",
    top: "\u52B3\u52A8\u5E03\u4E0A\u88C5\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u65E0\u6587\u5B57\u7F16\u53F7",
    bottom: "\u76F4\u7B52\u957F\u88E4\uFF0C\u5E03\u6599\u539A\u5B9E\uFF0C\u88E4\u7EBF\u81EA\u7136",
    outerwear: "\u8F7B\u8584\u5DE5\u4F5C\u5916\u5957\u534A\u62AB\u5728\u4E0A\u5C42\uFF0C\u80A9\u7EBF\u6734\u7D20",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u5C42\u6B21",
    shoes: "\u6DF1\u8272\u5E03\u978B\uFF0C\u978B\u5E95\u4F4E\uFF0C\u771F\u5B9E\u65E7\u611F",
    accessory: "\u7D20\u8272\u5934\u7EF3\u3001\u8896\u5957\u8FB9\u7F18\u3001\u65E7\u8155\u8868\uFF0C\u65E0\u526A\u5200\u65E0\u5DE5\u5177"
  }, ["16-20", "21-28", "29-38"]),
  capsule3("period-male-worker-90s", "\u5E74\u4EE3\u9752\u5E74\u5DE5\u88C5\u5957\u88C5", "male", ["period", "rural"], ["\u5E74\u4EE3", "\u5DE5\u4EBA", "\u7537\u4E3B", "\u5E95\u5C42"], "\u5E74\u4EE3\u9752\u5E74/\u5DE5\u4EBA\uFF0C\u771F\u5B9E\u4F46\u4E0D\u8DEF\u4EBA\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u5706\u9886\u5185\u642D\uFF0C\u54D1\u5149\uFF0C\u6709\u81EA\u7136\u8936\u76B1",
    top: "\u6D45\u84DD\u5DE5\u88C5\u886C\u886B\uFF0C\u659C\u7EB9\u5E03\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A",
    bottom: "\u6DF1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u5E03\u6599\u539A\u5B9E",
    outerwear: "\u519B\u7EFF\u8272\u77ED\u6B3E\u5DE5\u88C5\u5916\u5957\uFF0C\u5E06\u5E03\u6750\u8D28\uFF0C\u80A9\u7EBF\u5E72\u51C0",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u5DE5\u88C5\u978B",
    shoes: "\u9ED1\u8272\u5E03\u9762\u80F6\u5E95\u978B\u6216\u5DE5\u88C5\u978B\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u65E7\u76AE\u5E26\u3001\u6734\u7D20\u8155\u8868\u3001\u65E0\u5DE5\u5177\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("rural-male-village-bully-leather", "\u6751\u9738\u5730\u5934\u86C7\u76AE\u5939\u514B\u5957\u88C5", "male", ["rural", "period"], ["\u6751\u9738", "\u5730\u5934\u86C7", "\u7537\u53CD", "\u786C\u6C49"], "\u4E61\u6751\u6751\u9738/\u5730\u5934\u86C7\uFF0C\u7C97\u7C9D\u3001\u538B\u8FEB\u3001\u6709\u8FA8\u8BC6\u5EA6\u3002", {
    inner: "\u9ED1\u8272\u68C9\u8D28\u5706\u9886\u5185\u642D\uFF0C\u54D1\u5149\uFF0C\u8D34\u5408\u80A9\u80F8",
    top: "\u6697\u7EA2\u683C\u7EB9\u5F00\u9886\u886C\u886B\uFF0C\u7C97\u68C9\u5E03\u6599\uFF0C\u9886\u53E3\u655E\u5F00\u4F46\u4E0D\u51CC\u4E71",
    bottom: "\u6DF1\u7070\u76F4\u7B52\u5DE5\u88C5\u88E4\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u88E4\u811A\u7565\u6536",
    outerwear: "\u68D5\u9ED1\u77ED\u6B3E\u4EFF\u65E7\u76AE\u5939\u514B\uFF0C\u78E8\u7802\u76AE\u9769\uFF0C\u6709\u80A9\u80CC\u539A\u5EA6",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u5DE5\u88C5\u88E4\u548C\u7AD9\u59FF\u538B\u8FEB\u611F",
    shoes: "\u9ED1\u68D5\u539A\u5E95\u77ED\u9774\uFF0C\u978B\u5934\u7ED3\u5B9E\uFF0C\u6709\u6CE5\u571F\u78E8\u635F\u8D28\u611F",
    accessory: "\u7C97\u76AE\u5E26\u3001\u65E7\u91D1\u5C5E\u8170\u6263\u3001\u65E0\u70DF\u65E0\u5200\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50"]),
  capsule3("rural-male-village-chief-jacket", "\u6751\u957F\u6DF1\u7070\u5E72\u90E8\u5939\u514B", "male", ["rural", "period"], ["\u6751\u957F", "\u4E61\u9547\u5E72\u90E8", "\u5E72\u90E8", "\u4E66\u8BB0"], "\u6751\u957F/\u57FA\u5C42\u5E72\u90E8\uFF0C\u751F\u6D3B\u5316\u4F46\u6709\u6743\u5A01\u3002", {
    inner: "\u6D45\u84DD\u68C9\u8D28\u886C\u886B\uFF0C\u9886\u53E3\u5E73\u6574\uFF0C\u5E03\u6599\u54D1\u5149",
    top: "\u6DF1\u7070\u7FFB\u9886\u5E72\u90E8\u5939\u514B\uFF0C\u659C\u7EB9\u5E03\u633A\u62EC\uFF0C\u95E8\u895F\u548C\u53E3\u888B\u6E05\u695A",
    bottom: "\u9ED1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u5E03\u6599\u539A\u5B9E",
    outerwear: "\u6DF1\u7070\u77ED\u6B3E\u5916\u5957\uFF0C\u80A9\u7EBF\u7A33\uFF0C\u8170\u90E8\u4E0D\u677E\u57AE",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u7A33\u91CD\u7AD9\u59FF",
    shoes: "\u9ED1\u8272\u8F6F\u9762\u76AE\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u978B\u578B\u6734\u7D20",
    accessory: "\u65E7\u76AE\u5E26\u3001\u6734\u7D20\u8155\u8868\u3001\u65E0\u6587\u4EF6\u5939\u65E0\u624B\u6301\u7269"
  }, ["39-50", "51-65"]),
  capsule3("rural-male-township-cadre-navy", "\u4E61\u9547\u7537\u5E72\u90E8\u85CF\u84DD\u5939\u514B\u5957\u88C5", "male", ["rural", "period"], ["\u4E61\u9547\u5E72\u90E8", "\u9547\u957F", "\u4E61\u957F", "\u5E72\u90E8", "\u4E3B\u4EFB"], "\u4E61\u9547\u7537\u5E72\u90E8/\u57FA\u5C42\u8D1F\u8D23\u4EBA\uFF0C\u5E72\u7EC3\u4F46\u4E0D\u90FD\u5E02\u5316\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u886C\u886B\uFF0C\u9886\u53E3\u5E73\u6574\uFF0C\u5E03\u6599\u54D1\u5149",
    top: "\u6D45\u7070\u84DD\u7FFB\u9886\u886C\u886B\uFF0C\u68C9\u6DF7\u7EBA\u6750\u8D28\uFF0C\u95E8\u895F\u548C\u8896\u53E3\u6E05\u695A",
    bottom: "\u6DF1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u5E03\u6599\u539A\u5B9E",
    outerwear: "\u85CF\u84DD\u77ED\u6B3E\u5E72\u90E8\u5939\u514B\uFF0C\u659C\u7EB9\u5E03\u633A\u62EC\uFF0C\u80A9\u7EBF\u7A33\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u7A33\u91CD\u7AD9\u59FF",
    shoes: "\u9ED1\u8272\u4F4E\u5E2E\u76AE\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u978B\u578B\u6734\u7D20\u5E72\u51C0",
    accessory: "\u6734\u7D20\u8155\u8868\u3001\u6DF1\u8272\u76AE\u5E26\u3001\u65E0\u6587\u4EF6\u5939\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50", "51-65"]),
  capsule3("rural-female-villain-red-knit", "\u4E61\u6751\u5973\u53CD\u7EA2\u9488\u7EC7\u5957\u88C5", "female", ["rural", "period"], ["\u4E61\u6751", "\u5973\u53CD", "\u5A76\u5B50", "\u6751\u82B1"], "\u4E61\u6751\u5973\u53CD/\u6CFC\u8FA3\u5973\u914D\uFF0C\u989C\u8272\u9192\u76EE\u4F46\u4E0D\u5EC9\u4EF7\u3002", {
    inner: "\u7C73\u767D\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u5E03\u7EB9\u7EC6\u5BC6",
    top: "\u9152\u7EA2\u6536\u8170\u9488\u7EC7\u4E0A\u8863\uFF0C\u7C97\u7EC6\u9488\u811A\u53EF\u89C1\uFF0C\u80A9\u9888\u7EBF\u6E05\u695A",
    bottom: "\u6DF1\u84DD\u9AD8\u8170\u76F4\u7B52\u725B\u4ED4\u88E4\uFF0C\u88E4\u7EBF\u5E72\u51C0\uFF0C\u817F\u90E8\u6BD4\u4F8B\u597D",
    outerwear: "\u77ED\u6B3E\u6697\u7EA2\u683C\u7EB9\u5916\u642D\uFF0C\u68C9\u5E03\u6750\u8D28\uFF0C\u8170\u90E8\u7565\u6536",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u725B\u4ED4\u88E4\u548C\u817F\u90E8\u7EBF\u6761",
    shoes: "\u9ED1\u8272\u4F4E\u8DDF\u77ED\u9774\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u978B\u578B\u5229\u843D",
    accessory: "\u5C0F\u91D1\u8033\u5708\u3001\u7EC6\u76AE\u5E26\u3001\u65E0\u624B\u673A\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("rural-female-shopkeeper-mint", "\u5C0F\u5356\u90E8\u8001\u677F\u5A18\u8584\u8377\u886C\u886B\u5957\u88C5", "female", ["rural", "period"], ["\u5C0F\u5356\u90E8\u8001\u677F\u5A18", "\u8001\u677F\u5A18", "\u6751\u82B1", "\u4E61\u6751\u5973\u4E3B", "\u6210\u719F\u5973\u6027"], "\u4E61\u6751\u5C0F\u5356\u90E8\u8001\u677F\u5A18/\u6751\u82B1\uFF0C\u751F\u6D3B\u611F\u5F3A\u3001\u6E05\u723D\u3001\u6709\u8FA8\u8BC6\u5EA6\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u540A\u5E26\u5F0F\u5185\u5C42\uFF0C\u54D1\u5149\u4E0D\u5916\u9732\uFF0C\u670D\u52A1\u4E0A\u8863\u7EBF\u6761",
    top: "\u8584\u8377\u7EFF\u6536\u8170\u77ED\u8896\u886C\u886B\uFF0C\u68C9\u9EBB\u6DF7\u7EBA\uFF0C\u9886\u53E3\u548C\u8896\u53E3\u5E72\u51C0",
    bottom: "\u6DF1\u84DD\u9AD8\u8170\u5FAE\u5587\u725B\u4ED4\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A\uFF0C\u817F\u90E8\u6BD4\u4F8B\u597D",
    outerwear: "\u7C73\u767D\u77ED\u6B3E\u9488\u7EC7\u5F00\u886B\uFF0C\u8F7B\u8584\u67D4\u8F6F\uFF0C\u957F\u5EA6\u5361\u8170",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u725B\u4ED4\u88E4\u548C\u6E05\u723D\u6BD4\u4F8B",
    shoes: "\u6D45\u68D5\u4F4E\u8DDF\u5355\u978B\uFF0C\u54D1\u5149\u76AE\u9769\uFF0C\u978B\u578B\u79C0\u6C14",
    accessory: "\u5C0F\u73CD\u73E0\u8033\u9489\u3001\u7EC6\u76AE\u5E26\u3001\u5E03\u8D28\u53D1\u5939\u3001\u65E0\u8D26\u672C\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("rural-female-widow-dark-floral", "\u4E61\u6751\u5BE1\u5987\u6DF1\u82B1\u886C\u886B\u5957\u88C5", "female", ["rural", "period"], ["\u4E61\u6751\u5BE1\u5987", "\u5BE1\u5987", "\u5AC2\u5B50", "\u5973\u4E3B"], "\u4E61\u6751\u5BE1\u5987/\u82E6\u60C5\u5973\u4E3B\uFF0C\u514B\u5236\u4F46\u6709\u97E7\u6027\u548C\u7F8E\u611F\u3002", {
    inner: "\u6D45\u7C73\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u8D34\u5408\uFF0C\u54D1\u5149\u67D4\u8F6F",
    top: "\u6DF1\u9752\u788E\u82B1\u6536\u8170\u886C\u886B\uFF0C\u68C9\u5E03\u6750\u8D28\uFF0C\u82B1\u7EB9\u5C0F\u800C\u4E0D\u4E71",
    bottom: "\u9ED1\u84DD\u9AD8\u8170\u76F4\u7B52\u88E4\uFF0C\u5E03\u6599\u539A\u5B9E\uFF0C\u817F\u90E8\u6BD4\u4F8B\u6E05\u695A",
    outerwear: "\u6DF1\u7070\u8584\u6B3E\u9488\u7EC7\u5F00\u886B\uFF0C\u8896\u53E3\u7EB9\u7406\u6E05\u6670\uFF0C\u957F\u5EA6\u5361\u8170",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u88E4\u7EBF\u548C\u7A33\u4F4F\u7684\u4F53\u6001",
    shoes: "\u9ED1\u8272\u5E03\u9762\u5355\u978B\u6216\u4F4E\u8DDF\u77ED\u9774\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u7D20\u8272\u53D1\u5939\u3001\u7EC6\u94F6\u8033\u9489\u3001\u65E0\u7BEE\u5B50\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50"]),
  capsule3("rural-female-auntie-plaid-apron", "\u4E61\u6751\u5A76\u5B50\u683C\u7EB9\u886C\u886B\u5957\u88C5", "female", ["rural", "period"], ["\u4E61\u6751\u5A76\u5B50", "\u5A76\u5B50", "\u5927\u5988", "\u90BB\u5C45"], "\u4E61\u6751\u5A76\u5B50/\u90BB\u5C45\u5927\u5988\uFF0C\u751F\u6D3B\u611F\u5F3A\u4F46\u4E0D\u908B\u9062\u3002", {
    inner: "\u6D45\u7070\u68C9\u8D28\u5706\u9886\u5185\u642D\uFF0C\u5E03\u6599\u67D4\u8F6F\uFF0C\u6709\u81EA\u7136\u8936\u76B1",
    top: "\u84DD\u7070\u683C\u7EB9\u886C\u886B\uFF0C\u68C9\u5E03\u6750\u8D28\uFF0C\u8896\u53E3\u6574\u9F50\u5377\u8D77",
    bottom: "\u6DF1\u7070\u5BBD\u677E\u76F4\u7B52\u88E4\uFF0C\u88E4\u811A\u5E72\u51C0\uFF0C\u5E03\u6599\u539A\u5B9E",
    outerwear: "\u6DF1\u84DD\u8584\u5E03\u77ED\u5916\u5957\uFF0C\u5E03\u9762\u6709\u53E3\u888B\u7ED3\u6784\u4F46\u65E0\u6587\u5B57",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u88E4\u88C5\u548C\u751F\u6D3B\u5316\u4F53\u6001",
    shoes: "\u9ED1\u8272\u5E03\u978B\uFF0C\u978B\u9762\u5E72\u51C0\uFF0C\u6709\u8F7B\u5FAE\u751F\u6D3B\u78E8\u635F",
    accessory: "\u5E03\u8D28\u53D1\u7EF3\u3001\u6734\u7D20\u8033\u9489\u3001\u65E0\u83DC\u7BEE\u65E0\u624B\u6301\u7269"
  }, ["39-50", "51-65"]),
  capsule3("rural-female-motherinlaw-quilted", "\u519C\u6751\u5A46\u5A46\u6DF1\u68C9\u8884\u5957\u88C5", "female", ["rural", "period"], ["\u5A46\u5A46", "\u6BCD\u4EB2", "\u957F\u8F88", "\u7559\u5B88\u8001\u4EBA"], "\u519C\u6751\u5A46\u5A46/\u957F\u8F88\uFF0C\u771F\u5B9E\u3001\u6709\u8BB0\u5FC6\u70B9\u3001\u4E0D\u73B0\u4EE3\u3002", {
    inner: "\u6DF1\u8272\u68C9\u8D28\u5185\u886B\uFF0C\u9886\u53E3\u7565\u5BBD\u4F46\u6574\u6D01",
    top: "\u6697\u7D2B\u788E\u82B1\u68C9\u8884\u4E0A\u5C42\uFF0C\u7ED7\u7F1D\u7EB9\u7406\u6E05\u695A\uFF0C\u80A9\u80CC\u4E0D\u584C",
    bottom: "\u9ED1\u8272\u539A\u68C9\u957F\u88E4\uFF0C\u88E4\u578B\u76F4\uFF0C\u4FDD\u6696\u4F46\u4E0D\u81C3\u80BF",
    outerwear: "\u6DF1\u68D5\u65E0\u8896\u68C9\u9A6C\u7532\uFF0C\u8FB9\u7F18\u6EDA\u7EBF\u53EF\u89C1\uFF0C\u8170\u90E8\u7565\u6536",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u539A\u68C9\u88E4\u548C\u7A33\u91CD\u4F53\u6001",
    shoes: "\u9ED1\u8272\u68C9\u5E03\u978B\uFF0C\u978B\u53E3\u5706\u6DA6\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u65E7\u94F6\u8033\u9489\u3001\u5E03\u8D28\u8896\u5957\u8FB9\u7F18\u3001\u65E0\u62D0\u6756\u65E0\u624B\u6301\u7269"
  }, ["51-65", "66-80"]),
  capsule3("rural-male-returned-youth-clean", "\u8FD4\u4E61\u9752\u5E74\u6E05\u723D\u5DE5\u88C5\u5957\u88C5", "male", ["rural", "period"], ["\u8FD4\u4E61\u9752\u5E74", "\u8FD4\u4E61", "\u7537\u4E3B", "\u5927\u5B66\u751F"], "\u8FD4\u4E61\u9752\u5E74/\u4E61\u6751\u521B\u4E1A\u7537\u4E3B\uFF0C\u5E72\u51C0\u3001\u6709\u884C\u52A8\u529B\u3002", {
    inner: "\u767D\u8272\u539A\u68C9\u5706\u9886T\u6064\uFF0C\u54D1\u5149\uFF0C\u9886\u53E3\u5E72\u51C0",
    top: "\u6D45\u5361\u5176\u5DE5\u88C5\u886C\u886B\uFF0C\u659C\u7EB9\u5E03\uFF0C\u8896\u53E3\u81EA\u7136\u5377\u8D77",
    bottom: "\u6DF1\u84DD\u76F4\u7B52\u725B\u4ED4\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A\uFF0C\u817F\u90E8\u6BD4\u4F8B\u597D",
    outerwear: "\u6D45\u68D5\u77ED\u6B3E\u5E06\u5E03\u5939\u514B\uFF0C\u80A9\u7EBF\u81EA\u7136\uFF0C\u8170\u90E8\u5229\u843D",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u725B\u4ED4\u88E4\u548C\u884C\u52A8\u611F",
    shoes: "\u767D\u8272\u5E06\u5E03\u978B\u6216\u6D45\u68D5\u5DE5\u88C5\u978B\uFF0C\u978B\u9762\u5E72\u51C0",
    accessory: "\u7EC6\u76AE\u5E26\u3001\u7B80\u6D01\u8155\u8868\u3001\u65E0\u80CC\u5305\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("rural-female-returned-youth-linen", "\u8FD4\u4E61\u5973\u9752\u5E74\u68C9\u9EBB\u5957\u88C5", "female", ["rural", "period"], ["\u8FD4\u4E61\u9752\u5E74", "\u8FD4\u4E61", "\u5973\u4E3B", "\u5927\u5B66\u751F"], "\u8FD4\u4E61\u5973\u9752\u5E74/\u4E61\u6751\u521B\u4E1A\u5973\u4E3B\uFF0C\u6E05\u723D\u4F46\u5438\u775B\u3002", {
    inner: "\u767D\u8272\u68C9\u9EBB\u5185\u642D\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u7EB9\u7406\u7EC6\u5BC6",
    top: "\u6D45\u7EFF\u6536\u8170\u68C9\u9EBB\u886C\u886B\uFF0C\u8896\u53E3\u6574\u9F50\uFF0C\u80A9\u9888\u7EBF\u6E05\u695A",
    bottom: "\u7C73\u767D\u9AD8\u8170\u76F4\u7B52\u957F\u88E4\uFF0C\u5E03\u6599\u5782\u5760\uFF0C\u817F\u90E8\u6BD4\u4F8B\u660E\u786E",
    outerwear: "\u6D45\u5361\u5176\u77ED\u6B3E\u9A6C\u7532\uFF0C\u5E06\u5E03\u6750\u8D28\uFF0C\u8170\u90E8\u7565\u6536",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u9AD8\u8170\u88E4\u548C\u5E72\u51C0\u6BD4\u4F8B",
    shoes: "\u6D45\u8272\u5E06\u5E03\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u978B\u578B\u8F7B\u4FBF",
    accessory: "\u7EC6\u53D1\u5939\u3001\u5C0F\u94F6\u8033\u9489\u3001\u65E0\u76F8\u673A\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("rural-female-township-cadre-blouse", "\u4E61\u9547\u5973\u5E72\u90E8\u84DD\u886C\u886B\u5957\u88C5", "female", ["rural", "period"], ["\u4E61\u9547\u5E72\u90E8", "\u5E72\u90E8", "\u4E66\u8BB0", "\u4E3B\u4EFB"], "\u57FA\u5C42\u5973\u5E72\u90E8\uFF0C\u5E72\u7EC3\u3001\u4EB2\u548C\u3001\u4E0D\u50CF\u90FD\u5E02\u767D\u9886\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u5E73\u6574\uFF0C\u5E03\u6599\u54D1\u5149",
    top: "\u6D45\u84DD\u7FFB\u9886\u886C\u886B\uFF0C\u68C9\u6DF7\u7EBA\u6750\u8D28\uFF0C\u8896\u53E3\u548C\u95E8\u895F\u6E05\u695A",
    bottom: "\u6DF1\u7070\u9AD8\u8170\u76F4\u7B52\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u884C\u52A8\u65B9\u4FBF",
    outerwear: "\u85CF\u84DD\u77ED\u6B3E\u5E72\u90E8\u5939\u514B\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u65E0\u6587\u5B57\u6807\u8BC6",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u7A33\u91CD\u7AD9\u59FF",
    shoes: "\u9ED1\u8272\u4F4E\u8DDF\u76AE\u978B\uFF0C\u54D1\u5149\uFF0C\u978B\u578B\u6734\u7D20",
    accessory: "\u6734\u7D20\u8155\u8868\u3001\u7EC6\u53D1\u5939\u3001\u65E0\u6587\u4EF6\u5939\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50"]),
  capsule3("rural-male-barefoot-doctor-white", "\u8D64\u811A\u533B\u751F\u767D\u5916\u5957\u5957\u88C5", "male", ["rural", "period"], ["\u8D64\u811A\u533B\u751F", "\u6751\u533B", "\u4E61\u533B", "\u533B\u751F"], "\u4E61\u6751\u533B\u751F/\u8D64\u811A\u533B\u751F\uFF0C\u6734\u7D20\u53EF\u4FE1\u3002", {
    inner: "\u6D45\u7070\u68C9\u8D28\u886C\u886B\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u6709\u81EA\u7136\u8936\u76B1",
    top: "\u6D45\u84DD\u68C9\u5E03\u4E0A\u8863\uFF0C\u8896\u53E3\u5E73\u6574\uFF0C\u5E03\u6599\u771F\u5B9E",
    bottom: "\u6DF1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u5E03\u6599\u8010\u78E8",
    outerwear: "\u65E7\u767D\u8272\u77ED\u533B\u52A1\u5916\u5957\uFF0C\u539A\u68C9\u6DF7\u7EBA\uFF0C\u53E3\u888B\u548C\u95E8\u895F\u6E05\u695A\uFF0C\u65E0\u59D3\u540D\u724C\u6587\u5B57",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u6734\u7D20\u978B\u5C65",
    shoes: "\u9ED1\u8272\u5E03\u9762\u80F6\u5E95\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u6709\u8F7B\u5FAE\u78E8\u635F",
    accessory: "\u6734\u7D20\u8155\u8868\u3001\u65E0\u542C\u8BCA\u5668\u65E0\u836F\u7BB1\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50", "51-65"]),
  capsule3("rural-male-contractor-boss", "\u5305\u5DE5\u5934\u68D5\u9ED1\u5939\u514B\u5957\u88C5", "male", ["rural", "period"], ["\u5305\u5DE5\u5934", "\u5DE5\u5934", "\u8001\u677F", "\u786C\u6C49"], "\u4E61\u6751\u5305\u5DE5\u5934/\u5C0F\u8001\u677F\uFF0C\u7C97\u7C9D\u3001\u6709\u94B1\u4F46\u4E0D\u7CBE\u82F1\u3002", {
    inner: "\u9ED1\u8272\u68C9\u8D28\u5185\u642D\uFF0C\u54D1\u5149\uFF0C\u8D34\u5408\u80F8\u80A9",
    top: "\u6DF1\u68D5\u5F00\u9886\u886C\u886B\uFF0C\u7C97\u68C9\u659C\u7EB9\uFF0C\u9886\u53E3\u786C\u633A",
    bottom: "\u9ED1\u7070\u5DE5\u88C5\u957F\u88E4\uFF0C\u53E3\u888B\u548C\u819D\u90E8\u7ED3\u6784\u660E\u786E",
    outerwear: "\u68D5\u9ED1\u77ED\u6B3E\u5939\u514B\uFF0C\u4EFF\u65E7\u76AE\u9769\u548C\u5E06\u5E03\u62FC\u63A5\uFF0C\u80A9\u80CC\u539A\u5B9E",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u5DE5\u88C5\u88E4\u548C\u529B\u91CF\u611F",
    shoes: "\u68D5\u9ED1\u539A\u5E95\u5DE5\u88C5\u9774\uFF0C\u978B\u5934\u7ED3\u5B9E\uFF0C\u6709\u78E8\u7802\u76AE\u7EB9\u7406",
    accessory: "\u5BBD\u76AE\u5E26\u3001\u65E7\u91D1\u5C5E\u8155\u8868\u3001\u65E0\u5B89\u5168\u5E3D\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50"]),
  capsule3("rural-male-farmer-orchard", "\u679C\u519C\u836F\u519C\u8010\u78E8\u5DE5\u88C5", "male", ["rural", "period"], ["\u679C\u519C", "\u836F\u519C", "\u83DC\u519C", "\u519C\u6237", "\u517B\u6B96\u6237"], "\u679C\u519C/\u836F\u519C/\u517B\u6B96\u6237\uFF0C\u52B3\u52A8\u611F\u771F\u5B9E\u4F46\u4E0D\u8DEF\u4EBA\u3002", {
    inner: "\u7C73\u767D\u68C9\u8D28\u5185\u642D\uFF0C\u54D1\u5149\uFF0C\u6709\u81EA\u7136\u8936\u76B1",
    top: "\u6D45\u68D5\u8010\u78E8\u5DE5\u88C5\u886C\u886B\uFF0C\u8896\u53E3\u5377\u8D77\uFF0C\u5E03\u7EB9\u7C97\u7EC6\u53EF\u89C1",
    bottom: "\u6DF1\u84DD\u8010\u78E8\u76F4\u7B52\u957F\u88E4\uFF0C\u819D\u90E8\u8F7B\u5FAE\u78E8\u635F\uFF0C\u88E4\u811A\u5229\u843D",
    outerwear: "\u519B\u7EFF\u8272\u8584\u6B3E\u5DE5\u88C5\u9A6C\u7532\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A\uFF0C\u65E0\u6587\u5B57",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u9774\u5B50",
    shoes: "\u6DF1\u68D5\u80F6\u5E95\u77ED\u9774\uFF0C\u978B\u5E95\u7ED3\u5B9E\uFF0C\u6709\u6CE5\u571F\u78E8\u635F\u8D28\u611F",
    accessory: "\u65E7\u76AE\u5E26\u3001\u5E03\u8D28\u62A4\u8155\u8FB9\u7F18\u3001\u65E0\u519C\u5177\u65E0\u624B\u6301\u7269"
  }, ["29-38", "39-50", "51-65"]),
  capsule3("rural-female-farm-owner-floral", "\u4E61\u6751\u5973\u519C\u6237\u788E\u82B1\u5DE5\u88C5", "female", ["rural", "period"], ["\u679C\u519C", "\u836F\u519C", "\u83DC\u519C", "\u519C\u6237", "\u517B\u6B96\u6237", "\u5973\u4E3B"], "\u4E61\u6751\u5973\u519C\u6237/\u679C\u56ED\u5973\u8001\u677F\uFF0C\u80FD\u5E72\u3001\u6F02\u4EAE\u3001\u6709\u751F\u6D3B\u611F\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u5185\u642D\uFF0C\u9886\u53E3\u5E72\u51C0\uFF0C\u54D1\u5149\u67D4\u8F6F",
    top: "\u6D45\u9EC4\u5C0F\u788E\u82B1\u6536\u8170\u886C\u886B\uFF0C\u68C9\u5E03\u6750\u8D28\uFF0C\u8896\u53E3\u5229\u843D",
    bottom: "\u6DF1\u84DD\u9AD8\u8170\u76F4\u7B52\u725B\u4ED4\u88E4\uFF0C\u88E4\u7EBF\u6E05\u695A\uFF0C\u817F\u90E8\u6BD4\u4F8B\u597D",
    outerwear: "\u6D45\u68D5\u77ED\u6B3E\u5DE5\u88C5\u9A6C\u7532\uFF0C\u5E06\u5E03\u6750\u8D28\uFF0C\u53E3\u888B\u7ED3\u6784\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u725B\u4ED4\u88E4\u548C\u7A33\u5065\u7AD9\u59FF",
    shoes: "\u6D45\u68D5\u5DE5\u88C5\u77ED\u9774\uFF0C\u78E8\u7802\u76AE\u9769\uFF0C\u6709\u8F7B\u5FAE\u751F\u6D3B\u78E8\u635F",
    accessory: "\u5E03\u8D28\u53D1\u7EF3\u3001\u7EC6\u76AE\u5E26\u3001\u65E0\u7B50\u65E0\u519C\u5177\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("rural-elder-grandfather-worn-jacket", "\u7559\u5B88\u7237\u7237\u65E7\u5939\u514B\u5957\u88C5", "male", ["rural", "period"], ["\u7559\u5B88\u8001\u4EBA", "\u7237\u7237", "\u8001\u4EBA", "\u7236\u4EB2"], "\u519C\u6751\u7559\u5B88\u8001\u4EBA\uFF0C\u771F\u5B9E\u3001\u6709\u8BB0\u5FC6\u70B9\u3002", {
    inner: "\u7070\u767D\u68C9\u8D28\u5185\u886B\uFF0C\u9886\u53E3\u7565\u65E7\u4F46\u5E72\u51C0",
    top: "\u6DF1\u7070\u65E7\u886C\u886B\uFF0C\u68C9\u5E03\u6750\u8D28\uFF0C\u8896\u53E3\u6709\u81EA\u7136\u78E8\u635F",
    bottom: "\u9ED1\u7070\u5BBD\u677E\u76F4\u7B52\u88E4\uFF0C\u5E03\u6599\u539A\u5B9E\uFF0C\u88E4\u811A\u5E72\u51C0",
    outerwear: "\u65E7\u519B\u7EFF\u8272\u68C9\u5939\u514B\uFF0C\u80A9\u80CC\u7565\u584C\u4F46\u8F6E\u5ED3\u6E05\u695A\uFF0C\u53E3\u888B\u7ED3\u6784\u660E\u663E",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u8001\u4EBA\u7AD9\u59FF",
    shoes: "\u9ED1\u8272\u5E03\u978B\uFF0C\u978B\u9762\u4F4E\u53CD\u5149\uFF0C\u6709\u771F\u5B9E\u78E8\u635F",
    accessory: "\u65E7\u76AE\u5E26\u3001\u65E7\u91D1\u5C5E\u8155\u8868\u3001\u65E0\u70DF\u888B\u65E0\u62D0\u6756\u65E0\u624B\u6301\u7269"
  }, ["66-80", "80+"]),
  capsule3("rural-elder-grandmother-quilted-blue", "\u7559\u5B88\u5976\u5976\u84DD\u82B1\u68C9\u8884", "female", ["rural", "period"], ["\u7559\u5B88\u8001\u4EBA", "\u5976\u5976", "\u5A46\u5A46", "\u8001\u4EBA"], "\u519C\u6751\u7559\u5B88\u5976\u5976\uFF0C\u6734\u7D20\u771F\u5B9E\u4F46\u4E0D\u7CCA\u3002", {
    inner: "\u7C73\u7070\u68C9\u8D28\u5185\u886B\uFF0C\u9886\u53E3\u6574\u6D01\uFF0C\u5E03\u6599\u67D4\u8F6F",
    top: "\u84DD\u7070\u5C0F\u82B1\u68C9\u8884\u4E0A\u5C42\uFF0C\u7ED7\u7F1D\u7EB9\u7406\u6E05\u695A\uFF0C\u80A9\u80CC\u6709\u5E74\u9F84\u611F",
    bottom: "\u6DF1\u7070\u539A\u68C9\u957F\u88E4\uFF0C\u88E4\u578B\u76F4\uFF0C\u4FDD\u6696\u4F46\u4E0D\u8FC7\u5EA6\u81C3\u80BF",
    outerwear: "\u6DF1\u84DD\u68C9\u9A6C\u7532\u5916\u5C42\uFF0C\u8FB9\u7F18\u6EDA\u7EBF\u6E05\u695A\uFF0C\u8863\u6446\u6574\u9F50",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u539A\u68C9\u88E4\u548C\u7A33\u91CD\u4F53\u6001",
    shoes: "\u9ED1\u8272\u68C9\u5E03\u978B\uFF0C\u978B\u53E3\u5706\u6DA6\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u5E03\u8D28\u53D1\u7EF3\u3001\u65E7\u94F6\u8033\u9489\u3001\u65E0\u83DC\u7BEE\u65E0\u624B\u6301\u7269"
  }, ["66-80", "80+"]),
  capsule3("republican-female-qipao-pearl", "\u6C11\u56FD\u73CD\u73E0\u65D7\u888D\u9020\u578B", "female", ["republican"], ["\u6C11\u56FD", "\u65D7\u888D", "\u540D\u5A9B", "\u5973\u4E3B"], "\u6C11\u56FD\u540D\u5A9B/\u5973\u4E3B\uFF0C\u65D7\u888D\u3001\u73CD\u73E0\u3001\u590D\u53E4\u3002", {
    inner: "\u8C61\u7259\u8272\u8D34\u8EAB\u5185\u5C42\uFF0C\u5E73\u6574\u4E0D\u5916\u9732\uFF0C\u670D\u52A1\u65D7\u888D\u7EBF\u6761",
    top: "\u58A8\u7EFF\u4E1D\u7ED2\u65D7\u888D\u4E0A\u8EAB\uFF0C\u76D8\u6263\u6E05\u695A\uFF0C\u9886\u53E3\u8D34\u5408",
    bottom: "\u58A8\u7EFF\u65D7\u888D\u4E0B\u6446\uFF0C\u4FA7\u5F00\u8869\u514B\u5236\uFF0C\u6697\u7EB9\u7EC6\u5BC6",
    outerwear: "\u73CD\u73E0\u767D\u77ED\u62AB\u80A9\uFF0C\u4E1D\u7ED2\u8FB9\u7F18\uFF0C\u80A9\u9888\u7EBF\u6E05\u695A",
    legwear: "\u81EA\u7136\u80A4\u8272\u817F\u90E8\uFF0C\u4F4E\u53CD\u5149\uFF0C\u7EBF\u6761\u4F18\u96C5",
    shoes: "\u9ED1\u8272\u590D\u53E4\u739B\u4E3D\u73CD\u9AD8\u8DDF\u978B\uFF0C\u978B\u9762\u67D4\u5149",
    accessory: "\u73CD\u73E0\u8033\u5760\u3001\u7EC6\u624B\u956F\u3001\u65E0\u9999\u70DF\u65E0\u624B\u5305"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("republican-male-young-master", "\u6C11\u56FD\u5C11\u7237\u957F\u5916\u5957", "male", ["republican"], ["\u6C11\u56FD", "\u5C11\u7237", "\u5546\u4F1A", "\u7537\u4E3B"], "\u6C11\u56FD\u5C11\u7237/\u5546\u4F1A\u7537\u4E3B\uFF0C\u957F\u5916\u5957\u3001\u8D35\u6C14\u3001\u65E7\u4E0A\u6D77\u3002", {
    inner: "\u767D\u8272\u9AD8\u9886\u886C\u886B\uFF0C\u68C9\u5E9C\u7EF8\u6750\u8D28\uFF0C\u9886\u53E3\u633A\u62EC",
    top: "\u6DF1\u7070\u9A6C\u7532\uFF0C\u7F8A\u6BDB\u6750\u8D28\uFF0C\u6263\u4F4D\u6E05\u695A",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u590D\u53E4\u6BD4\u4F8B",
    outerwear: "\u6DF1\u68D5\u7F8A\u6BDB\u957F\u5916\u5957\uFF0C\u8863\u6446\u5782\u5760\uFF0C\u80A9\u7EBF\u786C\u633A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u957F\u5916\u5957",
    shoes: "\u9ED1\u8272\u590D\u53E4\u76AE\u978B\uFF0C\u978B\u578B\u4FEE\u957F\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u6000\u8868\u94FE\u7ED3\u6784\u3001\u8896\u6263\u3001\u65E0\u53EF\u8BFB\u62A5\u7EB8\u65E0\u624B\u6756"
  }, ["21-28", "29-38", "39-50"]),
  capsule3("elder-female-matriarch-jade", "\u8C6A\u95E8\u8001\u592A\u592A\u7FE1\u7FE0\u5957\u88C5", "female", ["elder", "modern"], ["\u5976\u5976", "\u5A46\u5A46", "\u957F\u8F88", "\u5BB6\u4E3B"], "\u8C6A\u95E8\u5973\u6027\u957F\u8F88\uFF0C\u7FE1\u7FE0\u3001\u7F8A\u6BDB\u3001\u6743\u5A01\u3002", {
    inner: "\u6DF1\u7D2B\u67D4\u8F6F\u68C9\u8D28\u5185\u642D\uFF0C\u54D1\u5149\uFF0C\u9886\u53E3\u7565\u5BBD\u677E",
    top: "\u58A8\u7EFF\u7F8A\u6BDB\u9488\u7EC7\u4E0A\u88C5\uFF0C\u7EB9\u7406\u539A\u5B9E\uFF0C\u80A9\u7EBF\u81EA\u7136",
    bottom: "\u6DF1\u7070\u957F\u88D9\u6216\u76F4\u7B52\u957F\u88E4\uFF0C\u5782\u5760\u539A\u5B9E\uFF0C\u8936\u76B1\u771F\u5B9E",
    outerwear: "\u6DF1\u58A8\u7EFF\u7F8A\u6BDB\u5F00\u886B\u5916\u5957\uFF0C\u95E8\u895F\u548C\u8896\u53E3\u7EB9\u7406\u6E05\u695A",
    legwear: "\u957F\u88D9\u6216\u957F\u88E4\u8986\u76D6\u817F\u90E8\uFF0C\u91CD\u70B9\u8868\u73B0\u771F\u5B9E\u4F53\u6001",
    shoes: "\u9ED1\u8272\u8F6F\u5E95\u76AE\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u6709\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9",
    accessory: "\u7FE1\u7FE0\u8033\u9970\u3001\u7389\u956F\u3001\u65E7\u91D1\u80F8\u9488\uFF0C\u4E0D\u624B\u6301\u62D0\u6756"
  }, ["66-80", "80+"]),
  capsule3("elder-male-patriarch-wool", "\u8C6A\u95E8\u8001\u7237\u5B50\u7F8A\u6BDB\u5957\u88C5", "male", ["elder", "modern"], ["\u7237\u7237", "\u7236\u4EB2", "\u5BB6\u4E3B", "\u957F\u8F88"], "\u7537\u6027\u5BB6\u65CF\u957F\u8F88\uFF0C\u7F8A\u6BDB\u3001\u6743\u5A01\u3001\u771F\u5B9E\u5E74\u9F84\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u886C\u886B\uFF0C\u9886\u53E3\u7565\u5BBD\u677E\u4F46\u6574\u6D01",
    top: "\u6DF1\u7070\u7F8A\u6BDB\u80CC\u5FC3\uFF0C\u539A\u5B9E\u54D1\u5149\uFF0C\u6263\u4F4D\u6E05\u695A",
    bottom: "\u9ED1\u7070\u76F4\u7B52\u957F\u88E4\uFF0C\u5E03\u6599\u539A\uFF0C\u8936\u76B1\u771F\u5B9E",
    outerwear: "\u6DF1\u68D5\u7F8A\u6BDB\u5F00\u886B\u6216\u77ED\u5916\u5957\uFF0C\u80A9\u80CC\u633A\u62D4\uFF0C\u95E8\u895F\u7EB9\u7406\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u771F\u5B9E\u8001\u5E74\u4F53\u6001",
    shoes: "\u9ED1\u8272\u8F6F\u5E95\u76AE\u978B\uFF0C\u4F4E\u53CD\u5149\uFF0C\u8F7B\u5FAE\u78E8\u635F",
    accessory: "\u65E7\u91D1\u5C5E\u8155\u8868\u3001\u7389\u6273\u6307\u6216\u80F8\u9488\uFF0C\u4E0D\u624B\u6301\u62D0\u6756"
  }, ["66-80", "80+"]),
  capsule3("home-female-sleepwear-mother", "\u6BCD\u4EB2\u7761\u8863\u5C45\u5BB6\u72B6\u6001", "female", ["modern", "elder"], ["\u6BCD\u4EB2", "\u7761\u8863", "\u5C45\u5BB6", "\u957F\u8F88"], "\u5BB6\u5EAD\u4F26\u7406\u5E38\u89C1\u6BCD\u4EB2\u7761\u8863\u72B6\u6001\uFF0C\u771F\u5B9E\u4F46\u4E0D\u908B\u9062\u3002", {
    inner: "\u6D45\u7C73\u68C9\u8D28\u7761\u8863\u5185\u5C42\uFF0C\u67D4\u8F6F\u54D1\u5149\uFF0C\u9886\u53E3\u81EA\u7136",
    top: "\u6D45\u7C89\u957F\u8896\u7761\u8863\u4E0A\u88C5\uFF0C\u68C9\u8D28\uFF0C\u7EBD\u6263\u548C\u8896\u53E3\u6E05\u695A",
    bottom: "\u6D45\u7C89\u76F4\u7B52\u7761\u88E4\uFF0C\u88E4\u811A\u81EA\u7136\uFF0C\u5E03\u6599\u6709\u67D4\u8F6F\u8936\u76B1",
    outerwear: "\u7C73\u767D\u8584\u9488\u7EC7\u5C45\u5BB6\u5916\u5957\uFF0C\u677E\u5F1B\u4F46\u4E0D\u57AE\uFF0C\u80A9\u7EBF\u4ECD\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u7761\u88E4\u8936\u76B1",
    shoes: "\u6D45\u8272\u5C45\u5BB6\u8F6F\u5E95\u62D6\u978B\uFF0C\u5E72\u51C0\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u5C0F\u53D1\u5939\u3001\u6734\u7D20\u8033\u9489\u3001\u65E0\u624B\u673A\u65E0\u624B\u6301\u7269"
  }, ["39-50", "51-65"]),
  capsule3("home-male-sleepwear-relaxed", "\u7537\u6027\u7761\u8863\u5C45\u5BB6\u72B6\u6001", "male", ["modern", "elder"], ["\u7537\u4E3B", "\u7236\u4EB2", "\u7761\u8863", "\u5C45\u5BB6", "\u957F\u8F88"], "\u5BB6\u5EAD/\u73B0\u4EE3\u7537\u6027\u7761\u8863\u72B6\u6001\uFF0C\u8212\u9002\u4F46\u4E0D\u908B\u9062\uFF0C\u9002\u914D\u5E74\u8F7B\u7537\u4E3B\u548C\u7236\u4EB2\u957F\u8F88\u3002", {
    inner: "\u6D45\u7070\u68C9\u8D28\u7761\u8863\u5185\u5C42\uFF0C\u67D4\u8F6F\u54D1\u5149\uFF0C\u9886\u53E3\u81EA\u7136",
    top: "\u6DF1\u84DD\u957F\u8896\u7761\u8863\u4E0A\u88C5\uFF0C\u68C9\u8D28\uFF0C\u7EBD\u6263\u548C\u8896\u53E3\u6E05\u695A",
    bottom: "\u6DF1\u84DD\u76F4\u7B52\u7761\u88E4\uFF0C\u88E4\u811A\u81EA\u7136\uFF0C\u5E03\u6599\u6709\u67D4\u8F6F\u8936\u76B1",
    outerwear: "\u7070\u8272\u8584\u9488\u7EC7\u5C45\u5BB6\u5916\u5957\uFF0C\u80A9\u7EBF\u4E0D\u584C\uFF0C\u95E8\u895F\u6E05\u695A",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u7761\u88E4\u8936\u76B1",
    shoes: "\u6DF1\u8272\u5C45\u5BB6\u8F6F\u5E95\u62D6\u978B\uFF0C\u5E72\u51C0\u4F4E\u53CD\u5149",
    accessory: "\u6734\u7D20\u8155\u8868\u3001\u65E0\u624B\u673A\u65E0\u70DF\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38", "39-50", "51-65", "66-80"]),
  capsule3("home-male-father-shirt", "\u7236\u4EB2\u5C45\u5BB6\u886C\u886B\u72B6\u6001", "male", ["modern", "elder"], ["\u7236\u4EB2", "\u5C45\u5BB6", "\u957F\u8F88", "\u5BB6\u5EAD"], "\u5BB6\u5EAD\u4F26\u7406\u7236\u4EB2\u5C45\u5BB6\u72B6\u6001\uFF0C\u771F\u5B9E\u3001\u6709\u6027\u683C\u3002", {
    inner: "\u767D\u8272\u68C9\u8D28\u80CC\u5FC3\u6216\u5185\u642D\uFF0C\u54D1\u5149\uFF0C\u6709\u81EA\u7136\u8936\u76B1",
    top: "\u6D45\u7070\u5BB6\u5C45\u886C\u886B\uFF0C\u68C9\u9EBB\u6750\u8D28\uFF0C\u9886\u53E3\u7565\u677E",
    bottom: "\u6DF1\u7070\u76F4\u7B52\u5BB6\u5C45\u957F\u88E4\uFF0C\u5E03\u6599\u67D4\u8F6F\uFF0C\u88E4\u7EBF\u81EA\u7136",
    outerwear: "\u6DF1\u84DD\u8584\u5F00\u886B\u5916\u5957\uFF0C\u9488\u7EC7\u7EB9\u7406\u6E05\u695A\uFF0C\u80A9\u80CC\u4E0D\u584C",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u957F\u88E4\u548C\u5C45\u5BB6\u4F53\u6001",
    shoes: "\u6DF1\u8272\u5C45\u5BB6\u62D6\u978B\u6216\u8F6F\u5E95\u5E03\u978B\uFF0C\u4F4E\u53CD\u5149",
    accessory: "\u65E7\u8155\u8868\u3001\u6734\u7D20\u76AE\u5E26\u3001\u65E0\u70DF\u65E0\u624B\u673A"
  }, ["51-65", "66-80"]),
  capsule3("modern-female-home-luxe", "\u5E74\u8F7B\u5973\u4E3B\u5C45\u5BB6\u7CBE\u81F4\u5957\u88C5", "female", ["modern"], ["\u5973\u4E3B", "\u5C45\u5BB6", "\u7761\u8863", "\u767D\u6708\u5149"], "\u5E74\u8F7B\u5973\u4E3B\u5C45\u5BB6\u72B6\u6001\uFF0C\u8212\u9002\u4F46\u4ECD\u6709\u955C\u5934\u5438\u5F15\u529B\u3002", {
    inner: "\u5976\u6CB9\u767D\u9488\u7EC7\u5185\u642D\uFF0C\u7EC6\u817B\u67D4\u8F6F\uFF0C\u9886\u53E3\u5E72\u51C0",
    top: "\u6D45\u96FE\u84DD\u77ED\u6B3E\u9488\u7EC7\u4E0A\u88C5\uFF0C\u8D34\u5408\u8170\u7EBF\uFF0C\u8896\u53E3\u7EC6\u5BC6",
    bottom: "\u5976\u6CB9\u767D\u9AD8\u8170\u9488\u7EC7\u957F\u88E4\uFF0C\u5782\u5760\u67D4\u8F6F\uFF0C\u817F\u90E8\u6BD4\u4F8B\u6E05\u695A",
    outerwear: "\u6D45\u7070\u77ED\u6B3E\u67D4\u8F6F\u5F00\u886B\uFF0C\u95E8\u895F\u7EB9\u7406\u6E05\u695A\uFF0C\u4E0D\u906E\u8170\u7EBF",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u9488\u7EC7\u957F\u88E4\u5782\u5760",
    shoes: "\u6D45\u8272\u8F6F\u5E95\u5C45\u5BB6\u978B\uFF0C\u5E72\u51C0\u4F4E\u53CD\u5149",
    accessory: "\u5C0F\u73CD\u73E0\u8033\u9489\u3001\u7EC6\u53D1\u5708\u3001\u65E0\u6C34\u676F\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"]),
  capsule3("modern-female-sports-luxe", "\u8FD0\u52A8\u98CE\u5973\u4E3B\u5957\u88C5", "female", ["modern", "campus"], ["\u8FD0\u52A8", "\u5973\u4E3B", "\u6821\u56ED", "\u6D3B\u529B"], "\u8FD0\u52A8/\u5065\u8EAB/\u6821\u56ED\u5973\u4E3B\uFF0C\u6D3B\u529B\u548C\u597D\u8EAB\u6750\u3002", {
    inner: "\u767D\u8272\u8FD0\u52A8\u5185\u5C42\uFF0C\u5F39\u6027\u54D1\u5149\uFF0C\u80A9\u9888\u7EBF\u6E05\u695A",
    top: "\u6D45\u7070\u77ED\u6B3E\u8FD0\u52A8\u5916\u642D\uFF0C\u62C9\u94FE\u7ED3\u6784\uFF0C\u8170\u7EBF\u660E\u663E",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u8FD0\u52A8\u77ED\u88D9\u88E4\u6216\u7D27\u8EAB\u957F\u88E4\uFF0C\u7EBF\u6761\u5E72\u51C0",
    outerwear: "\u6D45\u84DD\u77ED\u6B3E\u8FD0\u52A8\u5939\u514B\uFF0C\u9632\u98CE\u5E03\u4F4E\u53CD\u5149\uFF0C\u8896\u53E3\u6536\u7D27",
    legwear: "\u81EA\u7136\u80A4\u8272\u817F\u90E8\u6216\u9ED1\u8272\u8FD0\u52A8\u88E4\u7EBF\uFF0C\u817F\u90E8\u6BD4\u4F8B\u6E05\u695A",
    shoes: "\u767D\u8272\u8FD0\u52A8\u978B\uFF0C\u978B\u578B\u8F7B\uFF0C\u5E72\u51C0\u65E0Logo\u6587\u5B57",
    accessory: "\u8FD0\u52A8\u53D1\u5E26\u3001\u5C0F\u8033\u9489\u3001\u7EC6\u8155\u5E26\uFF0C\u65E0\u624B\u6301\u6C34\u676F"
  }, ["16-20", "21-28", "29-38"]),
  capsule3("modern-male-sports-idol", "\u8FD0\u52A8\u7CFB\u7537\u4E3B\u5957\u88C5", "male", ["modern", "campus"], ["\u8FD0\u52A8", "\u7537\u4E3B", "\u6821\u56ED", "\u5C11\u5E74"], "\u8FD0\u52A8\u7CFB\u7537\u4E3B\uFF0C\u6E05\u723D\u3001\u6709\u80A9\u7EBF\u3001\u5E74\u8F7B\u3002", {
    inner: "\u767D\u8272\u8FD0\u52A8T\u6064\uFF0C\u68C9\u8D28\u5F39\u6027\uFF0C\u8D34\u5408\u80A9\u80CC",
    top: "\u6D45\u7070\u8FD0\u52A8\u536B\u8863\u6216\u62C9\u94FE\u4E0A\u88C5\uFF0C\u77ED\u6B3E\u4E0D\u538B\u8EAB\u9AD8",
    bottom: "\u9ED1\u8272\u76F4\u7B52\u8FD0\u52A8\u957F\u88E4\uFF0C\u88E4\u7EBF\u81EA\u7136\uFF0C\u817F\u957F\u660E\u663E",
    outerwear: "\u84DD\u767D\u77ED\u6B3E\u8FD0\u52A8\u5939\u514B\uFF0C\u9632\u98CE\u5E03\uFF0C\u8896\u53E3\u6536\u7D27",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u8FD0\u52A8\u88E4\u6BD4\u4F8B",
    shoes: "\u767D\u8272\u8FD0\u52A8\u978B\uFF0C\u978B\u578B\u4FEE\u957F\uFF0C\u65E0Logo\u6587\u5B57",
    accessory: "\u9ED1\u8272\u8FD0\u52A8\u8155\u5E26\u3001\u7B80\u6D01\u9879\u94FE\u3001\u65E0\u7403\u65E0\u624B\u6301\u7269"
  }, ["16-20", "21-28"]),
  capsule3("modern-female-rich-aunt-wine", "\u9152\u7EA2\u8D35\u5987\u59D1\u59D1\u5957\u88C5", "female", ["modern"], ["\u59D1\u59D1", "\u8D35\u5987", "\u6210\u719F\u5973\u53CD", "\u5A46\u5A46"], "\u6210\u719F\u5973\u53CD/\u59D1\u59D1\uFF0C\u9152\u7EA2\u3001\u7FE1\u7FE0\u3001\u538B\u8FEB\u3002", {
    inner: "\u9ED1\u8272\u4E1D\u7F0E\u5185\u642D\uFF0C\u67D4\u5149\u5782\u5760\uFF0C\u9886\u53E3\u7CBE\u81F4",
    top: "\u9152\u7EA2\u4FEE\u8EAB\u9488\u7EC7\u4E0A\u88C5\uFF0C\u7EC6\u5BC6\u7EB9\u7406\uFF0C\u8170\u90E8\u6536\u675F",
    bottom: "\u9ED1\u8272\u9AD8\u8170\u5305\u81C0\u88D9\uFF0C\u88D9\u8EAB\u539A\u5B9E\uFF0C\u540E\u5F00\u8869\u514B\u5236",
    outerwear: "\u9152\u7EA2\u4EAE\u9762\u6536\u8170\u897F\u88C5\u5916\u5957\uFF0C\u6697\u91D1\u6263\uFF0C\u80A9\u7EBF\u786C\u633A",
    legwear: "\u9ED1\u8272\u534A\u900F\u660E\u889C\u6750\uFF0C\u4F4E\u53CD\u5149\uFF0C\u817F\u90E8\u7EBF\u6761\u6E05\u695A",
    shoes: "\u9152\u7EA2\u7EC6\u8DDF\u9AD8\u8DDF\u978B\uFF0C\u978B\u9762\u67D4\u5149",
    accessory: "\u7FE1\u7FE0\u624B\u956F\u3001\u91D1\u8272\u8033\u5760\u3001\u5B9D\u77F3\u80F8\u9488\uFF0C\u4E0D\u624B\u6301\u5305"
  }, ["39-50", "51-65"]),
  capsule3("modern-male-rich-uncle-brown", "\u8C6A\u95E8\u53D4\u4F2F\u68D5\u8272\u5957\u88C5", "male", ["modern", "career"], ["\u53D4\u4F2F", "\u7236\u4EB2", "\u5BB6\u4E3B", "\u7537\u53CD"], "\u6210\u719F\u7537\u6027\u957F\u8F88/\u53D4\u4F2F\uFF0C\u68D5\u8272\u3001\u6743\u529B\u3001\u6210\u719F\u3002", {
    inner: "\u5976\u6CB9\u767D\u886C\u886B\uFF0C\u9886\u53E3\u633A\u62EC\uFF0C\u5E03\u6599\u539A\u5B9E",
    top: "\u6DF1\u68D5\u7F8A\u6BDB\u9A6C\u7532\uFF0C\u6263\u4F4D\u6E05\u695A\uFF0C\u80F8\u8170\u7EBF\u7A33\u5B9A",
    bottom: "\u6DF1\u7070\u9AD8\u8170\u897F\u88E4\uFF0C\u88E4\u7EBF\u7B14\u76F4\uFF0C\u7A33\u91CD",
    outerwear: "\u6DF1\u68D5\u7F8A\u6BDB\u897F\u88C5\u5916\u5957\uFF0C\u80A9\u7EBF\u786C\u633A\uFF0C\u7FFB\u9886\u5BBD",
    legwear: "\u65E0\u660E\u663E\u889C\u6750\uFF0C\u91CD\u70B9\u8868\u73B0\u897F\u88E4\u548C\u5916\u5957\u539A\u5EA6",
    shoes: "\u6DF1\u68D5\u76AE\u978B\uFF0C\u64E6\u4EAE\u514B\u5236\uFF0C\u978B\u578B\u6210\u719F",
    accessory: "\u91D1\u5C5E\u8155\u8868\u3001\u9886\u5E26\u5939\u3001\u65E7\u91D1\u6212\u6307"
  }, ["39-50", "51-65"]),
  capsule3("fantasy-female-cyber-priestess", "\u79D1\u5E7B\u5723\u5973\u94F6\u767D\u5957\u88C5", "female", ["modern", "fantasy", "xianxia"], ["\u79D1\u5E7B", "\u5723\u5973", "\u767D\u53D1", "\u9B54\u6CD5"], "\u79D1\u5E7B/\u7384\u5E7B\u5723\u5973\uFF0C\u94F6\u767D\u3001\u51B7\u5149\u3001\u795E\u79D8\u3002", {
    inner: "\u94F6\u767D\u8D34\u8EAB\u9AD8\u9886\u5185\u5C42\uFF0C\u5F39\u6027\u7EC7\u7269\uFF0C\u51B7\u5149\u4F4E\u53CD\u5C04",
    top: "\u767D\u94F6\u7ED3\u6784\u77ED\u4E0A\u88C5\uFF0C\u80A9\u90E8\u51E0\u4F55\u526A\u88C1\uFF0C\u8170\u7EBF\u6536\u7D27",
    bottom: "\u94F6\u767D\u9AD8\u8170\u957F\u88D9\u6216\u88D9\u88E4\uFF0C\u524D\u6446\u5F00\u8869\u514B\u5236\uFF0C\u5C42\u6B21\u6E05\u695A",
    outerwear: "\u534A\u900F\u660E\u94F6\u767D\u957F\u5916\u5C42\uFF0C\u51E0\u4F55\u8FB9\u7F18\uFF0C\u65E0\u53EF\u8BFB\u7B26\u53F7",
    legwear: "\u767D\u8272\u6216\u94F6\u7070\u8D34\u8EAB\u817F\u90E8\u6750\u8D28\uFF0C\u4F4E\u53CD\u5149",
    shoes: "\u94F6\u767D\u77ED\u9774\uFF0C\u51E0\u4F55\u978B\u5E95\uFF0C\u51B7\u94F6\u6263\u4EF6",
    accessory: "\u51B7\u94F6\u8033\u9970\u3001\u51E0\u4F55\u8170\u6263\u3001\u4E0D\u53EF\u8BFB\u7EB9\u8DEF\u91D1\u5C5E\u4EF6"
  }, ["21-28", "29-38"]),
  capsule3("fantasy-male-cyber-knight", "\u79D1\u5E7B\u9A91\u58EB\u9ED1\u94F6\u5957\u88C5", "male", ["modern", "fantasy"], ["\u79D1\u5E7B", "\u9A91\u58EB", "\u5F02\u80FD"], "\u79D1\u5E7B\u9A91\u58EB/\u5F02\u80FD\u7537\u4E3B\uFF0C\u9ED1\u94F6\u3001\u8F7B\u7532\u3001\u5F3A\u80A9\u7EBF\u3002", {
    inner: "\u9ED1\u8272\u8D34\u8EAB\u673A\u80FD\u5185\u5C42\uFF0C\u5F39\u6027\u54D1\u5149\uFF0C\u663E\u80A9\u80CC",
    top: "\u9ED1\u94F6\u8F7B\u7532\u5F0F\u4E0A\u88C5\uFF0C\u80F8\u80A9\u7ED3\u6784\u6E05\u695A\uFF0C\u91D1\u5C5E\u8FB9\u4F4E\u53CD\u5149",
    bottom: "\u9ED1\u8272\u673A\u80FD\u957F\u88E4\uFF0C\u819D\u90E8\u7ED3\u6784\u548C\u88E4\u7EBF\u6E05\u695A",
    outerwear: "\u9ED1\u94F6\u77ED\u62AB\u98CE\u5F0F\u5916\u5C42\uFF0C\u80A9\u90E8\u62A4\u7247\uFF0C\u51E0\u4F55\u8FB9\u7F18",
    legwear: "\u9ED1\u8272\u62A4\u817F\uFF0C\u94F6\u8272\u6263\u5E26\uFF0C\u884C\u52A8\u611F\u5F3A",
    shoes: "\u9ED1\u8272\u539A\u5E95\u673A\u80FD\u9774\uFF0C\u51B7\u94F6\u6263\u4EF6\uFF0C\u978B\u578B\u5229\u843D",
    accessory: "\u94F6\u8272\u62A4\u8155\u3001\u51E0\u4F55\u8170\u6263\u3001\u65E0\u5251\u65E0\u67AA\u65E0\u624B\u6301\u7269"
  }, ["21-28", "29-38"])
];
var WARDROBE_CAPSULES = [
  ...BASE_WARDROBE_CAPSULES,
  ...EXTRA_WARDROBE_CAPSULES,
  ...SUPPLEMENTAL_WARDROBE_CAPSULES,
  ...DIVERSITY_WARDROBE_CAPSULES,
  ...WORLD_WARDROBE_CAPSULES,
  ...GLAMOUR_WARDROBE_CAPSULES
];

// services/assetTaxonomyService.ts
var ASSET_TAXONOMY_CACHE_MS = 5 * 60 * 1e3;

// services/characterStylingAgent.ts
var HARD_OUTERWEAR_RE = new RegExp([
  "\\u7fbd\\u7ed2\\u670d",
  "\\u5916\\u5957",
  "\\u5927\\u8863",
  "\\u98ce\\u8863",
  "\\u62ab\\u80a9",
  "\\u6597\\u7bf7",
  "\\u5939\\u514b",
  "\\u76ae\\u8863",
  "\\u897f\\u88c5\\u5916\\u5957",
  "\\u94e0\\u7532",
  "\\u6218\\u7532",
  "\\u76d4\\u7532"
].join("|"), "u");
var HARD_TOP_RE = new RegExp([
  "\\u4e0a\\u8863",
  "\\u4e0a\\u88c5",
  "\\u5185\\u642d",
  "\\u886c\\u886b",
  "T\\u6064",
  "\\u536b\\u8863",
  "\\u6bdb\\u8863",
  "\\u9488\\u7ec7\\u886b"
].join("|"), "iu");
var HARD_BOTTOM_RE = new RegExp([
  "\\u88e4",
  "\\u88d9",
  "\\u8fde\\u8863\\u88d9",
  "\\u77ed\\u88d9",
  "\\u957f\\u88d9"
].join("|"), "u");
var WARDROBE_COLOR_WORD_RE = /勃艮第酒红|浅粉白|粉白色|月白色|玄黑色|石榴红|玫红|正红|大红|绛红|绯红|银红|胭脂红|胭脂|绛紫|墨紫|灰紫|藕粉|藕荷|烟粉|浅粉|粉白|粉色|深海蓝|雾霾蓝|冰蓝|钴蓝|天蓝|湖蓝|靛蓝|黛蓝|月白|奶白|霜白|素白|雪白|玄黑|玄墨|松烟|苔绿|竹绿|官绿|豆青|孔雀青|苍青|天青|鸦青|靛青|琥珀橙|橙色|秋香色|秋香|鹅黄|黄色|雾灰|茶褐|褐色|焦糖|赤金|古银|旧银|旧铜|孔雀蓝绿|深炭灰|深色|暗色|深橄榄绿|珍珠白|象牙白|奶油白|珍珠绿|玫瑰豆沙|深梅紫|暖灰褐|玄红黑|烟蓝灰|烟紫灰|灰蓝|黑茶色|黑灰|黑银|黑金|黑白|黑红|黑蓝|黑棕|黑色|深黑|墨黑|炭灰|烟灰色|烟灰|银灰|深灰|浅灰|灰白|灰色|白色|纯白|冷白|米白|米灰|浅米|浅蓝|深蓝|旧蓝|雾蓝|蓝白|藏蓝|宝蓝|蓝色|墨绿|青绿|军绿|橄榄绿|深绿|绿色|暗紫|暗红|酒红|深红|红色|浅驼|驼棕|卡其|土棕|土黄|深棕|棕色|米色|浅杏|奶茶色|古金|暗金|浅金|金色|冷银|银色|青铜|古铜|深咖|深褐|裸粉/gu;
var HAIR_COLOR_WORD_RE = /月白银色|银白色|白金色|黑茶色|冷黑色|黑灰|黑色|深棕|栗棕|雾棕|烟灰色|灰白|银灰|红黑|黑蓝|暗紫黑/gu;
var WARDROBE_COLOR_WORD_TEST_RE = new RegExp(WARDROBE_COLOR_WORD_RE.source, "u");
var HAIR_COLOR_WORD_TEST_RE = new RegExp(HAIR_COLOR_WORD_RE.source, "u");

// services/characterStylingAiService.ts
init_characterAgeIndex();
init_voiceCueFormatter();

// services/doubaoVoiceCatalogLocal.ts
var DOUBAO_SHORTDRAMA_VOICES = [
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_qingcang_uranus_bigtts",
    "name": "\u64CE\u82CD 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u756A\u8304\u5C0F\u8BF4\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u6296\u97F3\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 14,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_chunribu_uranus_bigtts",
    "name": "\u6625\u65E5\u90E8\u59D0\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_linxiao_uranus_bigtts",
    "name": "\u6797\u6F47 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_lingling_uranus_bigtts",
    "name": "\u73B2\u73B2\u59D0\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_lubanqihao_uranus_bigtts",
    "name": "\u9C81\u73ED\u4E03\u53F7 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "cartoon_comedy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u98CE\u683C\u5316\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": [
      "recognizable_character_style"
    ]
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_peiqi_uranus_bigtts",
    "name": "\u4F69\u5947\u732A 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "video_dubbing",
      "cartoon_comedy"
    ],
    "categories": [
      "\u89C6\u9891\u914D\u97F3"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u98CE\u683C\u5316\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": [
      "recognizable_character_style"
    ]
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_popo_uranus_bigtts",
    "name": "\u5A46\u5A46 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "general_dialogue",
      "mother_elder_female"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u4E2D\u5E74\u5973\u58F0\uFF0C\u751F\u6D3B\u611F\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_silang_uranus_bigtts",
    "name": "\u56DB\u90CE 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_xionger_uranus_bigtts",
    "name": "\u718A\u4E8C 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "cartoon_comedy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u98CE\u683C\u5316\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": [
      "recognizable_character_style"
    ]
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_xuanyijieshuo_uranus_bigtts",
    "name": "\u60AC\u7591\u89E3\u8BF4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "narration",
      "narrator"
    ],
    "categories": [
      "\u6709\u58F0\u9605\u8BFB"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_yingtaowanzi_uranus_bigtts",
    "name": "\u6A31\u6843\u4E38\u5B50 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "cartoon_comedy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u98CE\u683C\u5316\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": [
      "recognizable_character_style"
    ]
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_zhishuaiyingzi_uranus_bigtts",
    "name": "\u76F4\u7387\u82F1\u5B50 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 12,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_baqiqingshu_uranus_bigtts",
    "name": "\u9738\u6C14\u9752\u53D4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "narration",
      "narrator",
      "father_uncle_male"
    ],
    "categories": [
      "\u6709\u58F0\u9605\u8BFB"
    ],
    "platformLabels": [
      "\u756A\u8304\u5C0F\u8BF4\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 10,
    "fallbackDescription": "\u4E2D\u5E74\u7537\u58F0\uFF0C\u6210\u719F\u7A33\u91CD\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_ruyaqingnian_uranus_bigtts",
    "name": "\u5112\u96C5\u9752\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u756A\u8304\u5C0F\u8BF4\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 10,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_wenroushunv_uranus_bigtts",
    "name": "\u6E29\u67D4\u6DD1\u5973 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u756A\u8304\u5C0F\u8BF4\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 10,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_chanmeinv_uranus_bigtts",
    "name": "\u8C04\u5A9A\u5973\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 9,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_cixingjieshuonan_uranus_bigtts",
    "name": "\u78C1\u6027\u89E3\u8BF4\u7537\u58F0/Morgan 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "narrator"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 9,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_ganmaodianyin_uranus_bigtts",
    "name": "\u611F\u5192\u7535\u97F3\u59D0\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 9,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_gujie_uranus_bigtts",
    "name": "\u987E\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 9,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_kailangdidi_uranus_bigtts",
    "name": "\u5F00\u6717\u5F1F\u5F1F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 9,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_zhuangzhou_uranus_bigtts",
    "name": "\u5E84\u5468 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 9,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_jitangmei_uranus_bigtts",
    "name": "\u9E21\u6C64\u59B9\u59B9/Hope 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "motivational"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 8,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_naiqimengwa_uranus_bigtts",
    "name": "\u5976\u6C14\u840C\u5A03 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u513F\u7AE5",
    "ageBand": "child",
    "tags": [
      "general_dialogue",
      "sweet_playful"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u526A\u6620\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 8,
    "fallbackDescription": "\u513F\u7AE5\u7537\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_nvleishen_uranus_bigtts",
    "name": "\u5973\u96F7\u795E 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u526A\u6620\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 8,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_tangseng_uranus_bigtts",
    "name": "\u5510\u50E7 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E",
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 8,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": [
      "recognizable_character_style"
    ]
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_zhubajie_uranus_bigtts",
    "name": "\u732A\u516B\u6212 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "cartoon_comedy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 8,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u98CE\u683C\u5316\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": [
      "recognizable_character_style"
    ]
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_aojiaonvyou_tob",
    "name": "\u50B2\u5A07\u5973\u53CB 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_aomanshaoye_tob",
    "name": "\u50B2\u6162\u5C11\u7237 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_bingjiaodidi_tob",
    "name": "\u75C5\u5A07\u5F1F\u5F1F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_bingjiaogege_tob",
    "name": "\u75C5\u5A07\u54E5\u54E5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_bingjiaojiejie_tob",
    "name": "\u75C5\u5A07\u59D0\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_chengshujiejie_tob",
    "name": "\u6210\u719F\u59D0\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_chunzhenxuedi_tob",
    "name": "\u7EAF\u771F\u5B66\u5F1F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_guanggaojieshuo_uranus_bigtts",
    "name": "\u5E7F\u544A\u89E3\u8BF4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "narrator"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_jiaxiaozi_tob",
    "name": "\u5047\u5C0F\u5B50 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_lengjunshangsi_tob",
    "name": "\u51B7\u5CFB\u4E0A\u53F8 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u4E2D\u5E74\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_shaonianjiangjun_tob",
    "name": "\u5C11\u5E74\u5C06\u519B 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_shenmifashi_tob",
    "name": "\u795E\u79D8\u6CD5\u5E08 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_tiexinnanyou_tob",
    "name": "\u8D34\u5FC3\u7537\u53CB 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tiexinnvyou_tob",
    "name": "\u8D34\u5FC3\u5973\u53CB 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_wenrounantongzhuo_tob",
    "name": "\u6E29\u67D4\u7537\u540C\u684C 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_wuzetian_uranus_bigtts",
    "name": "\u6B66\u5219\u5929 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u526A\u6620\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": [
      "recognizable_character_style"
    ]
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_xingganyujie_tob",
    "name": "\u6027\u611F\u5FA1\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_xuebanantongzhuo_tob",
    "name": "\u5B66\u9738\u7537\u540C\u684C 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_yourougongzi_tob",
    "name": "\u4F18\u67D4\u516C\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_youmodaye_tob",
    "name": "\u5E7D\u9ED8\u5927\u7237 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u8001\u5E74",
    "ageBand": "elder",
    "tags": [
      "role_play",
      "positive_young"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u8001\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_youmoshushu_tob",
    "name": "\u5E7D\u9ED8\u53D4\u53D4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "role_play",
      "father_uncle_male",
      "positive_young"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E",
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 5,
    "fallbackDescription": "\u4E2D\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u6210\u719F\u7A33\u91CD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_kailangxuezhang_uranus_bigtts",
    "name": "\u5F00\u6717\u5B66\u957F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 4,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_kuailexiaodong_uranus_bigtts",
    "name": "\u5FEB\u4E50\u5C0F\u4E1C 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 4,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_qinqienv_uranus_bigtts",
    "name": "\u4EB2\u5207\u5973\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 4,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_qingshuangnanda_uranus_bigtts",
    "name": "\u6E05\u723D\u7537\u5927 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 4,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_wenjingmaomao_uranus_bigtts",
    "name": "\u6587\u9759\u6BDB\u6BDB 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 4,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_youyoujunzi_uranus_bigtts",
    "name": "\u60A0\u60A0\u541B\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "ancient_fantasy"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 4,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_zhenbiandiyu_tob",
    "name": "\u6795\u8FB9\u4F4E\u8BED 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u6296\u97F3\u540C\u6B3E"
    ],
    "popularityScore": 4,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_anrenqinzhu_tob",
    "name": "\u9EEF\u5203\u79E6\u4E3B 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_bingruogongzi_tob",
    "name": "\u75C5\u5F31\u516C\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_chunzhenshaonv_tob",
    "name": "\u7EAF\u771F\u5C11\u5973 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_gaolengchenwen_uranus_bigtts",
    "name": "\u9AD8\u51B7\u6C89\u7A33 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "dominant_cold"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_guaogongzi_tob",
    "name": "\u5B64\u50B2\u516C\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_jinglingxiangdao_tob",
    "name": "\u7CBE\u7075\u5411\u5BFC 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_lengkugege_tob",
    "name": "\u51B7\u9177\u54E5\u54E5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_menyoupingxiaoge_tob",
    "name": "\u95F7\u6CB9\u74F6\u5C0F\u54E5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_naiqixiaosheng_tob",
    "name": "\u5976\u6C14\u5C0F\u751F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_wenrounvshen_tob",
    "name": "\u6E29\u67D4\u5973\u795E 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_wumeiyujie_tob",
    "name": "\u59A9\u5A9A\u5FA1\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u8C46\u5305\u540C\u6B3E"
    ],
    "popularityScore": 3,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_aomanjiaosheng_tob",
    "name": "\u50B2\u6162\u5A07\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_aoqilingren_tob",
    "name": "\u50B2\u6C14\u51CC\u4EBA 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_bingjiaobailian_tob",
    "name": "\u75C5\u5A07\u767D\u83B2 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_bingjiaomengmei_tob",
    "name": "\u75C5\u5A07\u840C\u59B9 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_chenwenyouya_tob",
    "name": "\u6C89\u7A33\u4F18\u96C5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_chengshuwenrou_tob",
    "name": "\u6210\u719F\u6E29\u67D4 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_dichenqianquan_tob",
    "name": "\u4F4E\u6C89\u7F31\u7EFB 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tiaopigongzhu_tob",
    "name": "\u8C03\u76AE\u516C\u4E3B 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_fuheigongzi_tob",
    "name": "\u8179\u9ED1\u516C\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_guzhibingjiao_tob",
    "name": "\u56FA\u6267\u75C5\u5A07 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_guayanxiaoge_tob",
    "name": "\u5BE1\u8A00\u5C0F\u54E5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_guiyishenmi_tob",
    "name": "\u8BE1\u5F02\u795E\u79D8 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_hanhoudunshi_tob",
    "name": "\u61A8\u539A\u6566\u5B9E 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_huopodiaoman_tob",
    "name": "\u6D3B\u6CFC\u5201\u86EE 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_huoposhuanglang_tob",
    "name": "\u6D3B\u6CFC\u723D\u6717 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_jiaohannvwang_tob",
    "name": "\u5A07\u61A8\u5973\u738B 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_jiaoruoluoli_tob",
    "name": "\u5A07\u5F31\u841D\u8389 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_kailangqingkuai_tob",
    "name": "\u5F00\u6717\u8F7B\u5FEB 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_keainvsheng_tob",
    "name": "\u53EF\u7231\u5973\u751F 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_lanyincaohunshi_tob",
    "name": "\u84DD\u94F6\u8349\u9B42\u5E08 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_lengdanshuli_tob",
    "name": "\u51B7\u6DE1\u758F\u79BB 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_shuaizhenxiaohuo_tob",
    "name": "\u7387\u771F\u5C0F\u4F19 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_lvchaxiaoge_tob",
    "name": "\u7EFF\u8336\u5C0F\u54E5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_nuanxintitie_tob",
    "name": "\u6696\u5FC3\u4F53\u8D34 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_nuanxinxuejie_tob",
    "name": "\u6696\u5FC3\u5B66\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qingsexiaosheng_tob",
    "name": "\u9752\u6DA9\u5C0F\u751F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qinglangwenrun_tob",
    "name": "\u6E05\u6717\u6E29\u6DA6 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_qinglenggaoya_tob",
    "name": "\u6E05\u51B7\u9AD8\u96C5 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qinglengjingui_tob",
    "name": "\u6E05\u51B7\u77DC\u8D35 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qingyisugan_tob",
    "name": "\u6E05\u9038\u82CF\u611F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_rouguhunshi_tob",
    "name": "\u67D4\u9AA8\u9B42\u5E08 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_ruyacaijun_tob",
    "name": "\u5112\u96C5\u624D\u4FCA 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "positive_young"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_sajiaonianren_tob",
    "name": "\u6492\u5A07\u7C98\u4EBA 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tianmeihuopo_tob",
    "name": "\u751C\u7F8E\u6D3B\u6CFC 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tianmeijiaoqiao_tob",
    "name": "\u751C\u7F8E\u5A07\u4FCF 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_wenrouneilian_tob",
    "name": "\u6E29\u67D4\u5185\u655B 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_wenrouwenya_tob",
    "name": "\u6E29\u67D4\u6587\u96C5 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F",
      "S2S-SC"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_xiaosasuixing_tob",
    "name": "\u6F47\u6D12\u968F\u6027 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_youroubangzhu_tob",
    "name": "\u4F18\u67D4\u5E2E\u4E3B 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_zhengzhiqingnian_tob",
    "name": "\u6B63\u76F4\u9752\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_zhixingwenwan_tob",
    "name": "\u77E5\u6027\u6E29\u5A49 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [
      "\u732B\u7BB1\u540C\u6B3E"
    ],
    "popularityScore": 2,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_aojiaobazong_uranus_bigtts",
    "name": "\u50B2\u5A07\u9738\u603B 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "dominant_cold"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_xiaoxue_uranus_bigtts",
    "name": "\u513F\u7AE5\u7ED8\u672C 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u513F\u7AE5",
    "ageBand": "child",
    "tags": [
      "narration",
      "narrator"
    ],
    "categories": [
      "\u6709\u58F0\u9605\u8BFB"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u513F\u7AE5\u5973\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_gaolengyujie_uranus_bigtts",
    "name": "\u9AD8\u51B7\u5FA1\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "dominant_cold"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_huolixiaoge_uranus_bigtts",
    "name": "\u6D3B\u529B\u5C0F\u54E5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_jieshuoxiaoming_uranus_bigtts",
    "name": "\u89E3\u8BF4\u5C0F\u660E 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "narrator"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_kailangjiejie_uranus_bigtts",
    "name": "\u5F00\u6717\u59D0\u59D0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_liangsangmengzai_uranus_bigtts",
    "name": "\u4EAE\u55D3\u840C\u4ED4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u513F\u7AE5",
    "ageBand": "child",
    "tags": [
      "general_dialogue",
      "sweet_playful"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u513F\u7AE5\u7537\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_linjiananhai_uranus_bigtts",
    "name": "\u90BB\u5BB6\u7537\u5B69 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_linjianvhai_uranus_bigtts",
    "name": "\u90BB\u5BB6\u5973\u5B69 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_mengyatou_uranus_bigtts",
    "name": "\u840C\u4E2B\u5934/Cutey 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "general_dialogue",
      "sweet_playful"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_kefunvsheng_uranus_bigtts",
    "name": "\u6696\u9633\u5973\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_qiaopinv_uranus_bigtts",
    "name": "\u4FCF\u76AE\u5973\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "sweet_playful"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_qingxinnvsheng_uranus_bigtts",
    "name": "\u6E05\u65B0\u5973\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_ruyayichen_uranus_bigtts",
    "name": "\u5112\u96C5\u9038\u8FB0 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "video_dubbing",
      "positive_young"
    ],
    "categories": [
      "\u89C6\u9891\u914D\u97F3"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_sajiaoxuemei_uranus_bigtts",
    "name": "\u6492\u5A07\u5B66\u59B9 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_shaoergushi_uranus_bigtts",
    "name": "\u5C11\u513F\u6545\u4E8B 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u513F\u7AE5",
    "ageBand": "child",
    "tags": [
      "narration",
      "narrator"
    ],
    "categories": [
      "\u6709\u58F0\u9605\u8BFB"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u513F\u7AE5\u5973\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_shenyeboke_uranus_bigtts",
    "name": "\u6DF1\u591C\u64AD\u5BA2 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "narrator"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_tianmeitaozi_uranus_bigtts",
    "name": "\u751C\u7F8E\u6843\u5B50 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "sweet_playful"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_tianmeixiaoyuan_uranus_bigtts",
    "name": "\u751C\u7F8E\u5C0F\u6E90 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "sweet_playful"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_tianmeiyueyue_uranus_bigtts",
    "name": "\u751C\u7F8E\u60A6\u60A6 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "sweet_playful"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_tiexinnvsheng_uranus_bigtts",
    "name": "\u8D34\u5FC3\u5973\u58F0/Candy 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_wennuanahu_uranus_bigtts",
    "name": "\u6E29\u6696\u963F\u864E/Alvin 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_wenroumama_uranus_bigtts",
    "name": "\u6E29\u67D4\u5988\u5988 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "general_dialogue",
      "mother_elder_female",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u4E2D\u5E74\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u751F\u6D3B\u611F\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_wenrouxiaoge_uranus_bigtts",
    "name": "\u6E29\u67D4\u5C0F\u54E5 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_wenrouxiaoya_uranus_bigtts",
    "name": "\u6E29\u67D4\u5C0F\u96C5 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u9752\u5E74\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_yangguangqingnian_uranus_bigtts",
    "name": "\u9633\u5149\u9752\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "general_dialogue",
      "positive_young"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_yizhipiannan_uranus_bigtts",
    "name": "\u8BD1\u5236\u7247\u7537 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "narrator"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_male_yuanboxiaoshu_uranus_bigtts",
    "name": "\u6E0A\u535A\u5C0F\u53D4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "general_dialogue",
      "father_uncle_male"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u4E2D\u5E74\u7537\u58F0\uFF0C\u6210\u719F\u7A33\u91CD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_cancan_uranus_bigtts",
    "name": "\u77E5\u6027\u707F\u707F 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_zhixingnv_uranus_bigtts",
    "name": "\u77E5\u6027\u5973\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_yingyujiaoxue_uranus_bigtts",
    "name": "Tina\u8001\u5E08 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "teacher",
      "professional_service"
    ],
    "categories": [
      "\u6559\u80B2\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "zh_female_tvbnv_uranus_bigtts",
    "name": "TVB\u5973\u58F0 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "narrator"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 1,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_aojiaogongzi_tob",
    "name": "\u50B2\u5A07\u516C\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "dominant_cold",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_aojiaojingying_tob",
    "name": "\u50B2\u5A07\u7CBE\u82F1 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14",
      "S2S-SC"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_aomanqingnian_tob",
    "name": "\u50B2\u6162\u9752\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_bingjiaonanyou_tob",
    "name": "\u75C5\u5A07\u7537\u53CB 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_bingjiaoshaonian_tob",
    "name": "\u75C5\u5A07\u5C11\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_chenwenmingzai_tob",
    "name": "\u6C89\u7A33\u660E\u4ED4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_gaolengzongcai_tob",
    "name": "\u9AD8\u51B7\u603B\u88C1 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_guaiqiaokeer_tob",
    "name": "\u4E56\u5DE7\u53EF\u513F 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_huzishushu_tob",
    "name": "\u80E1\u5B50\u53D4\u53D4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "role_play",
      "father_uncle_male"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u4E2D\u5E74\u7537\u58F0\uFF0C\u6210\u719F\u7A33\u91CD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_huoliqingnian_tob",
    "name": "\u6D3B\u529B\u9752\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "positive_young"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_kailangqingnian_tob",
    "name": "\u5F00\u6717\u9752\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "positive_young"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_kailangtingting_tob",
    "name": "\u5F00\u6717\u5A77\u5A77 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "positive_young",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_kaixinxiaohong_tob",
    "name": "\u5F00\u5FC3\u5C0F\u9E3F 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_lengjungaozhi_tob",
    "name": "\u51B7\u5CFB\u9AD8\u667A 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "dominant_cold"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u51B7\u9759\u6709\u538B\u8FEB\u611F\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_lixingyuanzi_tob",
    "name": "\u7406\u6027\u5706\u5B50 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_linjuayi_tob",
    "name": "\u90BB\u5C45\u963F\u59E8 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "video_dubbing",
      "mother_elder_female"
    ],
    "categories": [
      "\u89C6\u9891\u914D\u97F3"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u4E2D\u5E74\u5973\u58F0\uFF0C\u751F\u6D3B\u611F\u8F83\u5F3A\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_lingdongxinxin_tob",
    "name": "\u7075\u52A8\u6B23\u6B23 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_neiliancaijun_tob",
    "name": "\u5185\u655B\u624D\u4FCA 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "narration",
      "narrator"
    ],
    "categories": [
      "\u6709\u58F0\u9605\u8BFB"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_nuanxinqianqian_tob",
    "name": "\u6696\u5FC3\u831C\u831C 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qinqiexiaozhuo_tob",
    "name": "\u4EB2\u5207\u5C0F\u5353 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_qingyingduoduo_tob",
    "name": "\u8F7B\u76C8\u6735\u6735 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qingshuangshaonian_tob",
    "name": "\u6E05\u723D\u5C11\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "positive_young"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_qingtianmeimei_tob",
    "name": "\u6E05\u751C\u8393\u8393 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_qingtiantaotao_tob",
    "name": "\u6E05\u751C\u6843\u6843 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_qingxixiaoxue_tob",
    "name": "\u6E05\u6670\u5C0F\u96EA 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qingxinbobo_tob",
    "name": "\u6E05\u65B0\u6CE2\u6CE2 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "gentle_clean",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_qingxinmumu_tob",
    "name": "\u6E05\u65B0\u6C90\u6C90 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "gentle_clean",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_reqingaina_tob",
    "name": "\u70ED\u60C5\u827E\u5A1C 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_ruyagongzi_tob",
    "name": "\u5112\u96C5\u516C\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "narration",
      "narrator",
      "positive_young",
      "ancient_fantasy"
    ],
    "categories": [
      "\u6709\u58F0\u9605\u8BFB"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_ruyajunzi_tob",
    "name": "\u5112\u96C5\u541B\u5B50 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "positive_young",
      "ancient_fantasy"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u9002\u5408\u53E4\u98CE\u89D2\u8272\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_ruyazongcai_tob",
    "name": "\u5112\u96C5\u603B\u88C1 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "positive_young"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_ruanmengtangtang_tob",
    "name": "\u8F6F\u840C\u7CD6\u7CD6 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "sweet_playful",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_ruanmengtuanzi_tob",
    "name": "\u8F6F\u840C\u56E2\u5B50 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "sweet_playful",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_sajiaonansheng_tob",
    "name": "\u6492\u5A07\u7537\u751F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "role_play",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_sajiaonanyou_tob",
    "name": "\u6492\u5A07\u7537\u53CB 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "sweet_playful"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_shuanglangxiaoyang_tob",
    "name": "\u723D\u6717\u5C0F\u9633 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tianmeixiaoju_tob",
    "name": "\u751C\u7F8E\u5C0F\u6A58 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "sweet_playful",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tianmeixiaoyu_tob",
    "name": "\u751C\u7F8E\u5C0F\u96E8 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "sweet_playful",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u751C\u7F8E\u8F7B\u5FEB\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tiexinguimi_tob",
    "name": "\u8D34\u5FC3\u95FA\u871C 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_tiexinmeimei_tob",
    "name": "\u8D34\u5FC3\u59B9\u59B9 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_wennuanshaonian_tob",
    "name": "\u6E29\u6696\u5C11\u5E74 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "narration",
      "narrator",
      "positive_young"
    ],
    "categories": [
      "\u6709\u58F0\u9605\u8BFB"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u9002\u5408\u65C1\u767D\u548C\u89E3\u8BF4\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_wenroubaiyueguang_tob",
    "name": "\u6E29\u67D4\u767D\u6708\u5149 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "general_dialogue",
      "gentle_clean"
    ],
    "categories": [
      "\u901A\u7528\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_wenrounanyou_tob",
    "name": "\u6E29\u67D4\u7537\u53CB 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u9752\u5E74",
    "ageBand": "young_adult",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u9752\u5E74\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_wenrouxuezhang_tob",
    "name": "\u6E29\u67D4\u5B66\u957F 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u5C11\u5E74/\u9752\u6625",
    "ageBand": "teen_young",
    "tags": [
      "role_play",
      "gentle_clean"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u5C11\u5E74/\u9752\u6625\u7537\u58F0\uFF0C\u6E29\u67D4\u6E05\u6670\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_wenwanshanshan_tob",
    "name": "\u6E29\u5A49\u73CA\u73CA 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_female_xiuliqianqian_tob",
    "name": "\u79C0\u4E3D\u5029\u5029 2.0",
    "language": "zh",
    "gender": "female",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u5973\u58F0\uFF0C\u81EA\u7136\u5BF9\u8BDD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_yangguangyangyang_tob",
    "name": "\u9633\u5149\u6D0B\u6D0B 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u6210\u4EBA\u672A\u660E",
    "ageBand": "adult_unknown",
    "tags": [
      "customer_service",
      "positive_young",
      "professional_service"
    ],
    "categories": [
      "\u5BA2\u670D\u573A\u666F"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u6210\u4EBA\u7537\u58F0\uFF0C\u660E\u4EAE\u81EA\u7136\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  },
  {
    "provider": "doubao",
    "model": "seed-tts-2.0",
    "id": "ICL_uranus_zh_male_younidashu_tob",
    "name": "\u6CB9\u817B\u5927\u53D4 2.0",
    "language": "zh",
    "gender": "male",
    "ageLabel": "\u4E2D\u5E74",
    "ageBand": "middle_aged",
    "tags": [
      "role_play",
      "father_uncle_male"
    ],
    "categories": [
      "\u89D2\u8272\u626E\u6F14"
    ],
    "platformLabels": [],
    "popularityScore": 0,
    "fallbackDescription": "\u4E2D\u5E74\u7537\u58F0\uFF0C\u6210\u719F\u7A33\u91CD\uFF0C\u8BED\u901F\u7A33\u5B9A\u3002",
    "riskFlags": []
  }
];

// services/doubaoVoiceSelection.ts
var DOUBAO_DEFAULT_MODEL = "seed-tts-2.0";
var DOUBAO_LEGACY_VOICE_CANDIDATES = [
  {
    voiceId: "zh_female_wenroushunv_uranus_bigtts",
    label: "female young gentle",
    gender: "female",
    ageBand: "young_adult",
    roleTags: ["gentle", "clean", "lead", "wife", "office"],
    fallbackDescription: "young female voice, gentle clean timbre, clear diction, stable natural texture"
  },
  {
    voiceId: "zh_female_linxiao_uranus_bigtts",
    label: "female adult roleplay",
    gender: "female",
    ageBand: "adult",
    roleTags: ["adult", "lead", "calm", "roleplay"],
    fallbackDescription: "adult female voice, natural roleplay timbre, clear diction, steady dramatic texture"
  },
  {
    voiceId: "zh_female_zhishuaiyingzi_uranus_bigtts",
    label: "female adult direct",
    gender: "female",
    ageBand: "adult",
    roleTags: ["direct", "sharp", "workplace", "strong"],
    fallbackDescription: "adult female voice, direct bright timbre, crisp diction, recognizable firm texture"
  },
  {
    voiceId: "zh_female_popo_uranus_bigtts",
    label: "female middle aged elder",
    gender: "female",
    ageBand: "middle_aged",
    roleTags: ["mother", "aunt", "elder", "family"],
    fallbackDescription: "middle-aged female voice, warm lower timbre, steady diction, family-drama texture"
  },
  {
    voiceId: "ICL_uranus_zh_female_chunzhenshaonv_tob",
    label: "female teen pure",
    gender: "female",
    ageBand: "teen",
    roleTags: ["teen", "student", "pure", "gentle"],
    fallbackDescription: "teenage female voice, clean youthful timbre, light diction, natural school-age texture"
  },
  {
    voiceId: "zh_female_linjianvhai_uranus_bigtts",
    label: "female teen girl next door",
    gender: "female",
    ageBand: "teen",
    roleTags: ["teen", "girl", "gentle", "neighbor"],
    fallbackDescription: "young girl voice, soft clean timbre, relaxed diction, natural youthful texture"
  },
  {
    voiceId: "zh_female_mengyatou_uranus_bigtts",
    label: "female child playful",
    gender: "female",
    ageBand: "child",
    roleTags: ["child", "cute", "playful"],
    fallbackDescription: "child female voice, sweet bright timbre, lively diction, playful texture"
  },
  {
    voiceId: "zh_male_ruyaqingnian_uranus_bigtts",
    label: "male young elegant",
    gender: "male",
    ageBand: "young_adult",
    roleTags: ["young", "lead", "gentle", "office", "husband"],
    fallbackDescription: "young male voice, warm elegant timbre, clear diction, stable natural texture"
  },
  {
    voiceId: "zh_male_qingcang_uranus_bigtts",
    label: "male adult cold dominant",
    gender: "male",
    ageBand: "adult",
    roleTags: ["cold", "dominant", "boss", "villain", "lead"],
    fallbackDescription: "adult male voice, low controlled timbre, firm diction, dramatic pressure texture"
  },
  {
    voiceId: "zh_male_cixingjieshuonan_uranus_bigtts",
    label: "male adult magnetic",
    gender: "male",
    ageBand: "adult",
    roleTags: ["magnetic", "narrator", "mature", "steady"],
    fallbackDescription: "adult male voice, magnetic mid-low timbre, smooth diction, stable mature texture"
  },
  {
    voiceId: "zh_male_baqiqingshu_uranus_bigtts",
    label: "male middle aged uncle",
    gender: "male",
    ageBand: "middle_aged",
    roleTags: ["father", "uncle", "boss", "middle-aged", "strong"],
    fallbackDescription: "middle-aged male voice, thick steady timbre, grounded diction, mature family-drama texture"
  },
  {
    voiceId: "ICL_uranus_zh_male_lengjunshangsi_tob",
    label: "male middle aged cold boss",
    gender: "male",
    ageBand: "middle_aged",
    roleTags: ["boss", "cold", "superior", "dominant"],
    fallbackDescription: "middle-aged male voice, cold low timbre, restrained diction, controlled pressure texture"
  },
  {
    voiceId: "zh_male_kailangdidi_uranus_bigtts",
    label: "male teen cheerful",
    gender: "male",
    ageBand: "teen",
    roleTags: ["teen", "brother", "student", "cheerful"],
    fallbackDescription: "teenage male voice, bright youthful timbre, quick clear diction, energetic texture"
  },
  {
    voiceId: "zh_male_qingshuangnanda_uranus_bigtts",
    label: "male young student",
    gender: "male",
    ageBand: "young_adult",
    roleTags: ["student", "young", "clean", "sunny"],
    fallbackDescription: "young male voice, fresh clean timbre, clear diction, campus-drama texture"
  },
  {
    voiceId: "zh_male_naiqimengwa_uranus_bigtts",
    label: "male child cute",
    gender: "male",
    ageBand: "child",
    roleTags: ["child", "cute", "boy"],
    fallbackDescription: "child male voice, soft cute timbre, light diction, lively child texture"
  },
  {
    voiceId: "ICL_uranus_zh_male_youmodaye_tob",
    label: "male elder",
    gender: "male",
    ageBand: "elder",
    roleTags: ["elder", "grandfather", "old"],
    fallbackDescription: "elder male voice, aged warm timbre, slower diction, stable elder texture"
  }
];
var normalizeDoubaoCatalogAgeBand = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.includes("child")) return "child";
  if (normalized.includes("teen")) return "teen";
  if (normalized.includes("young")) return "young_adult";
  if (normalized.includes("middle")) return "middle_aged";
  if (normalized.includes("elder") || normalized.includes("old")) return "elder";
  if (normalized === "child" || normalized === "teen" || normalized === "young_adult" || normalized === "middle_aged" || normalized === "elder") {
    return normalized;
  }
  return "adult";
};
var DOUBAO_CATALOG_VOICE_CANDIDATES = DOUBAO_SHORTDRAMA_VOICES.map((voice) => ({
  voiceId: voice.id,
  label: voice.name,
  gender: voice.gender,
  ageBand: normalizeDoubaoCatalogAgeBand(voice.ageBand),
  roleTags: voice.tags,
  fallbackDescription: voice.fallbackDescription
}));
var DOUBAO_CATALOG_VOICE_IDS = new Set(DOUBAO_CATALOG_VOICE_CANDIDATES.map((candidate) => candidate.voiceId));
var DOUBAO_VOICE_CANDIDATES = [
  ...DOUBAO_CATALOG_VOICE_CANDIDATES,
  ...DOUBAO_LEGACY_VOICE_CANDIDATES.filter((candidate) => !DOUBAO_CATALOG_VOICE_IDS.has(candidate.voiceId))
];
var DOUBAO_VOICE_CANDIDATES_FOR_UI = DOUBAO_VOICE_CANDIDATES.map((candidate) => ({
  ...candidate,
  model: DOUBAO_DEFAULT_MODEL,
  name: candidate.label
}));
var KNOWN_DOUBAO_VOICE_IDS = new Set(DOUBAO_VOICE_CANDIDATES.map((candidate) => candidate.voiceId));
var DOUBAO_VOICE_CANDIDATE_GUIDE = DOUBAO_VOICE_CANDIDATES.map((candidate) => `${candidate.voiceId} | ${candidate.gender} | ${candidate.ageBand} | ${candidate.label} | tags:${candidate.roleTags.join(",")} | ${candidate.fallbackDescription}`).join("\n");

// services/voiceDescriptionPresetExtras.ts
var VOICE_DESCRIPTION_PRESET_EXTRAS = [
  { key: "\u7537-\u513F\u7AE5-\u94F6\u4EAE", text: "\u7537\u7AE5\u94F6\u4EAE\uFF1A\u9AD8\u9891\u50CF\u94C3\u58F0\u4E00\u6837\u6E05\u900F\uFF0C\u5B57\u5934\u8F7B\u5FEB\uFF0C\u53E5\u5C3E\u77ED\u4FC3\u4E0A\u626C\u3002", gender: "\u7537", age: "\u513F\u7AE5", feature: "\u94F6\u4EAE" },
  { key: "\u7537-\u513F\u7AE5-\u8DF3\u8DC3\u8F7B\u5FEB", text: "\u7537\u7AE5\u8DF3\u8DC3\u8F7B\u5FEB\uFF1A\u8BED\u8C03\u8D77\u4F0F\u660E\u663E\uFF0C\u5B57\u5934\u8F7B\uFF0C\u77ED\u53E5\u53CD\u5E94\u5FEB\uFF0C\u505C\u987F\u91CC\u5E26\u7B11\u610F\u3002", gender: "\u7537", age: "\u513F\u7AE5", feature: "\u8DF3\u8DC3\u8F7B\u5FEB" },
  { key: "\u7537-\u513F\u7AE5-\u7AEF\u6B63\u6162\u901F", text: "\u7537\u7AE5\u7AEF\u6B63\u6162\u901F\uFF1A\u54AC\u5B57\u7AEF\u6B63\uFF0C\u8BED\u901F\u504F\u6162\uFF0C\u91CD\u97F3\u5C0F\u5FC3\u843D\u5728\u5173\u952E\u8BCD\u4E0A\u3002", gender: "\u7537", age: "\u513F\u7AE5", feature: "\u7AEF\u6B63\u6162\u901F" },
  { key: "\u7537-\u513F\u7AE5-\u54ED\u8154", text: "\u7537\u7AE5\u54ED\u8154\uFF1A\u9F3B\u97F3\u504F\u91CD\uFF0C\u5C3E\u97F3\u8F7B\u98A4\uFF0C\u6C14\u606F\u65AD\u7EED\u4F46\u4ECD\u4FDD\u6301\u7AE5\u58F0\u4EAE\u5EA6\u3002", gender: "\u7537", age: "\u513F\u7AE5", feature: "\u54ED\u8154" },
  { key: "\u7537-\u513F\u7AE5-\u7A1A\u5AE9\u6C89\u7A33", text: "\u7537\u7AE5\u7A1A\u5AE9\u6C89\u7A33\uFF1A\u7AE5\u58F0\u7A1A\u5AE9\u4F46\u8BED\u6C14\u538B\u7A33\uFF0C\u65AD\u53E5\u89C4\u77E9\uFF0C\u91CD\u97F3\u514B\u5236\u3002", gender: "\u7537", age: "\u513F\u7AE5", feature: "\u7A1A\u5AE9\u6C89\u7A33" },
  { key: "\u7537-\u5C11\u5E74-\u6E05\u51B7", text: "\u5C11\u5E74\u6E05\u51B7\uFF1A\u58F0\u7EBF\u504F\u8584\uFF0C\u6C14\u606F\u6536\u7A84\uFF0C\u53E5\u5C3E\u5E73\u76F4\u6536\u675F\uFF0C\u8DDD\u79BB\u611F\u660E\u663E\u3002", gender: "\u7537", age: "\u5C11\u5E74", feature: "\u6E05\u51B7" },
  { key: "\u7537-\u5C11\u5E74-\u5938\u5F20\u4E0A\u626C", text: "\u5C11\u5E74\u5938\u5F20\u4E0A\u626C\uFF1A\u91CD\u97F3\u5938\u5F20\uFF0C\u7206\u7834\u97F3\u6E05\u695A\uFF0C\u53E5\u5C3E\u4E0A\u626C\u5E26\u5F3A\u70C8\u5F20\u529B\u3002", gender: "\u7537", age: "\u5C11\u5E74", feature: "\u5938\u5F20\u4E0A\u626C" },
  { key: "\u7537-\u5C11\u5E74-\u786C\u6536\u77ED\u53E5", text: "\u5C11\u5E74\u786C\u6536\u77ED\u53E5\uFF1A\u54AC\u5B57\u504F\u7D27\uFF0C\u5C3E\u97F3\u786C\u6536\uFF0C\u77ED\u53E5\u91CC\u5E26\u538B\u4F4F\u60C5\u7EEA\u7684\u51B2\u52B2\u3002", gender: "\u7537", age: "\u5C11\u5E74", feature: "\u786C\u6536\u77ED\u53E5" },
  { key: "\u7537-\u5C11\u5E74-\u660E\u5FEB\u5598\u606F", text: "\u5C11\u5E74\u660E\u5FEB\u5598\u606F\uFF1A\u6C14\u53E3\u660E\u5FEB\uFF0C\u8282\u594F\u504F\u5FEB\uFF0C\u97F3\u5934\u5E72\u51C0\u5E76\u5E26\u8F7B\u5FAE\u5598\u606F\u6D3B\u529B\u3002", gender: "\u7537", age: "\u5C11\u5E74", feature: "\u660E\u5FEB\u5598\u606F" },
  { key: "\u7537-\u5C11\u5E74-\u7D27\u5F20", text: "\u5C11\u5E74\u7D27\u5F20\uFF1A\u6C14\u606F\u6D45\uFF0C\u505C\u987F\u9891\u7E41\uFF0C\u5B57\u5C3E\u8F7B\u6296\uFF0C\u8BED\u6D41\u7565\u663E\u6025\u4FC3\u3002", gender: "\u7537", age: "\u5C11\u5E74", feature: "\u7D27\u5F20" },
  { key: "\u7537-\u9752\u5E74-\u5C11\u5E74\u611F", text: "\u9752\u5E74\u7537\u58F0\u5C11\u5E74\u611F\uFF1A\u4E2D\u9AD8\u9891\u660E\u4EAE\uFF0C\u8BED\u901F\u8F7B\u5FEB\uFF0C\u4FDD\u7559\u5E72\u51C0\u9752\u6DA9\u7684\u4E0A\u626C\u5C3E\u97F3\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u5C11\u5E74\u611F" },
  { key: "\u7537-\u9752\u5E74-\u758F\u79BB", text: "\u9752\u5E74\u7537\u58F0\u758F\u79BB\uFF1A\u58F0\u7EBF\u504F\u51B7\uFF0C\u8D77\u4F0F\u6781\u5C11\uFF0C\u505C\u987F\u7559\u767D\u6E05\u695A\uFF0C\u60C5\u7EEA\u4E0D\u5916\u9732\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u758F\u79BB" },
  { key: "\u7537-\u9752\u5E74-\u70ED\u8840", text: "\u9752\u5E74\u7537\u58F0\u70ED\u8840\uFF1A\u80F8\u8154\u652F\u6491\u5F3A\uFF0C\u91CD\u97F3\u524D\u538B\uFF0C\u7206\u53D1\u53E5\u97F3\u91CF\u62AC\u5347\u660E\u663E\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u70ED\u8840" },
  { key: "\u7537-\u9752\u5E74-\u9634\u51B7\u4F4E\u538B", text: "\u9752\u5E74\u7537\u58F0\u9634\u51B7\u4F4E\u538B\uFF1A\u4F4E\u4E2D\u9891\u504F\u6697\uFF0C\u5C3E\u97F3\u7F13\u6162\u4E0B\u6C89\uFF0C\u6C14\u606F\u538B\u4F4E\uFF0C\u542C\u611F\u5E26\u51B7\u538B\u8FEB\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u9634\u51B7\u4F4E\u538B" },
  { key: "\u7537-\u9752\u5E74-\u7AEF\u6B63\u7A33\u58F0", text: "\u9752\u5E74\u7537\u58F0\u7AEF\u6B63\u7A33\u58F0\uFF1A\u8BED\u901F\u7A33\u5B9A\uFF0C\u5410\u5B57\u6E05\u695A\uFF0C\u91CD\u97F3\u514B\u5236\uFF0C\u53E5\u5F0F\u5E73\u76F4\u53EF\u9760\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u7AEF\u6B63\u7A33\u58F0" },
  { key: "\u7537-\u4E2D\u5E74-\u4F4E\u539A\u538B\u58F0", text: "\u4E2D\u5E74\u7537\u58F0\u4F4E\u539A\u538B\u58F0\uFF1A\u4F4E\u9891\u652F\u6491\u539A\uFF0C\u53E5\u5C3E\u4E0B\u538B\uFF0C\u505C\u987F\u679C\u65AD\uFF0C\u58F0\u97F3\u6709\u538B\u573A\u611F\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u4F4E\u539A\u538B\u58F0" },
  { key: "\u7537-\u4E2D\u5E74-\u5706\u6ED1\u6311\u5C3E", text: "\u4E2D\u5E74\u7537\u58F0\u5706\u6ED1\u6311\u5C3E\uFF1A\u5C3E\u97F3\u5706\u6ED1\u4E0A\u7ED5\uFF0C\u8BED\u8C03\u591A\u5F2F\uFF0C\u7B11\u610F\u85CF\u5728\u5B57\u5C3E\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u5706\u6ED1\u6311\u5C3E" },
  { key: "\u7537-\u4E2D\u5E74-\u75B2\u60EB", text: "\u4E2D\u5E74\u7537\u58F0\u75B2\u60EB\uFF1A\u6C14\u606F\u677E\u6563\uFF0C\u8BED\u901F\u7565\u6162\uFF0C\u5C3E\u97F3\u4E0B\u5760\uFF0C\u542C\u611F\u5E26\u5026\u610F\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u75B2\u60EB" },
  { key: "\u7537-\u4E2D\u5E74-\u7C97\u7C9D\u53E3\u8BED", text: "\u4E2D\u5E74\u7537\u58F0\u7C97\u7C9D\u53E3\u8BED\uFF1A\u53E3\u8BED\u611F\u91CD\uFF0C\u54AC\u5B57\u7565\u7C97\uFF0C\u8282\u594F\u76F4\u63A5\uFF0C\u8BED\u6C14\u8D34\u8FD1\u65E5\u5E38\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u7C97\u7C9D\u53E3\u8BED" },
  { key: "\u7537-\u4E2D\u5E74-\u6E29\u539A\u4F4E\u7F13", text: "\u4E2D\u5E74\u7537\u58F0\u6E29\u539A\u4F4E\u7F13\uFF1A\u4E2D\u4F4E\u9891\u6E29\u6696\uFF0C\u8BED\u6C14\u7A33\uFF0C\u53E5\u95F4\u7559\u767D\u957F\uFF0C\u542C\u611F\u5305\u5BB9\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u6E29\u539A\u4F4E\u7F13" },
  { key: "\u7537-\u8001\u5E74-\u98A4\u58F0", text: "\u8001\u5E74\u7537\u58F0\u98A4\u58F0\uFF1A\u58F0\u5E26\u95ED\u5408\u504F\u677E\uFF0C\u5C3E\u97F3\u7EC6\u98A4\uFF0C\u8BED\u901F\u6162\u800C\u65AD\u53E5\u6E05\u695A\u3002", gender: "\u7537", age: "\u8001\u5E74", feature: "\u98A4\u58F0" },
  { key: "\u7537-\u8001\u5E74-\u4E61\u97F3", text: "\u8001\u5E74\u7537\u58F0\u4E61\u97F3\uFF1A\u5B57\u8179\u5706\u539A\uFF0C\u5C40\u90E8\u5377\u820C\u5F31\u5316\uFF0C\u8BED\u6C14\u6734\u5B9E\u4EB2\u8FD1\u3002", gender: "\u7537", age: "\u8001\u5E74", feature: "\u4E61\u97F3" },
  { key: "\u7537-\u8001\u5E74-\u8BB2\u8BC4", text: "\u8001\u5E74\u7537\u58F0\u8BB2\u8BC4\uFF1A\u91CD\u97F3\u5206\u5C42\u660E\u786E\uFF0C\u53E5\u9996\u7A33\u8D77\uFF0C\u53E5\u5C3E\u6536\u675F\u5E26\u8BC4\u8BBA\u611F\u3002", gender: "\u7537", age: "\u8001\u5E74", feature: "\u8BB2\u8BC4" },
  { key: "\u7537-\u8001\u5E74-\u6C99\u54D1\u6311\u5C3E", text: "\u8001\u5E74\u7537\u58F0\u6C99\u54D1\u6311\u5C3E\uFF1A\u8F7B\u6C99\u54D1\u91CC\u5E26\u7B11\u610F\uFF0C\u5C3E\u97F3\u5FAE\u6311\uFF0C\u505C\u987F\u6709\u8BD5\u63A2\u611F\u3002", gender: "\u7537", age: "\u8001\u5E74", feature: "\u6C99\u54D1\u6311\u5C3E" },
  { key: "\u7537-\u8001\u5E74-\u865A\u5F31\u6C14\u77ED", text: "\u8001\u5E74\u7537\u58F0\u865A\u5F31\u6C14\u77ED\uFF1A\u6C14\u606F\u865A\uFF0C\u97F3\u91CF\u8F7B\uFF0C\u77ED\u53E5\u9891\u7E41\u6362\u6C14\uFF0C\u5C3E\u97F3\u8F7B\u98D8\u3002", gender: "\u7537", age: "\u8001\u5E74", feature: "\u865A\u5F31\u6C14\u77ED" },
  { key: "\u5973-\u513F\u7AE5-\u94F6\u94C3", text: "\u5973\u7AE5\u94F6\u94C3\uFF1A\u9AD8\u9891\u6E05\u8106\u50CF\u5C0F\u94C3\uFF0C\u97F3\u5934\u660E\u4EAE\uFF0C\u53E5\u5C3E\u8F7B\u5FEB\u5F39\u8D77\u3002", gender: "\u5973", age: "\u513F\u7AE5", feature: "\u94F6\u94C3" },
  { key: "\u5973-\u513F\u7AE5-\u602F\u8F6F", text: "\u5973\u7AE5\u602F\u8F6F\uFF1A\u97F3\u91CF\u5C0F\uFF0C\u6C14\u58F0\u8F7B\uFF0C\u5C3E\u97F3\u5185\u6536\uFF0C\u542C\u611F\u5C0F\u5FC3\u7FFC\u7FFC\u3002", gender: "\u5973", age: "\u513F\u7AE5", feature: "\u602F\u8F6F" },
  { key: "\u5973-\u513F\u7AE5-\u7A1A\u5AE9\u6C89\u7A33", text: "\u5973\u7AE5\u7A1A\u5AE9\u6C89\u7A33\uFF1A\u7AE5\u58F0\u91CC\u5E26\u538B\u7A33\u8BED\u6C14\uFF0C\u65AD\u53E5\u89C4\u6574\uFF0C\u91CD\u97F3\u6545\u4F5C\u6C89\u7A33\u3002", gender: "\u5973", age: "\u513F\u7AE5", feature: "\u7A1A\u5AE9\u6C89\u7A33" },
  { key: "\u5973-\u513F\u7AE5-\u9F3B\u97F3\u8F6F\u7CEF", text: "\u5973\u7AE5\u9F3B\u97F3\u8F6F\u7CEF\uFF1A\u9F3B\u8154\u5171\u9E23\u66F4\u660E\u663E\uFF0C\u5C3E\u97F3\u62C9\u957F\u4E0A\u626C\uFF0C\u8BED\u6C14\u8F6F\u7CEF\u4F9D\u8D56\u3002", gender: "\u5973", age: "\u513F\u7AE5", feature: "\u9F3B\u97F3\u8F6F\u7CEF" },
  { key: "\u5973-\u513F\u7AE5-\u7AEF\u6B63\u6E05\u8106", text: "\u5973\u7AE5\u7AEF\u6B63\u6E05\u8106\uFF1A\u5410\u5B57\u6E05\u695A\uFF0C\u8282\u594F\u7A33\u5B9A\uFF0C\u53E5\u5C3E\u5E72\u51C0\uFF0C\u7AE5\u58F0\u4EAE\u5EA6\u9AD8\u3002", gender: "\u5973", age: "\u513F\u7AE5", feature: "\u7AEF\u6B63\u6E05\u8106" },
  { key: "\u5973-\u5C11\u5E74-\u660E\u4EAE\u5FEB\u8BED", text: "\u5C11\u5973\u660E\u4EAE\u5FEB\u8BED\uFF1A\u9AD8\u9891\u4EAE\uFF0C\u8BED\u901F\u5FEB\uFF0C\u91CD\u97F3\u8F7B\u5F39\uFF0C\u6574\u4F53\u53CD\u5E94\u611F\u5F3A\u3002", gender: "\u5973", age: "\u5C11\u5E74", feature: "\u660E\u4EAE\u5FEB\u8BED" },
  { key: "\u5973-\u5C11\u5E74-\u77ED\u4FC3\u9510\u5229", text: "\u5C11\u5973\u77ED\u4FC3\u9510\u5229\uFF1A\u54AC\u5B57\u9510\u5229\uFF0C\u505C\u987F\u77ED\uFF0C\u5C3E\u97F3\u51B7\u6311\uFF0C\u5410\u5B57\u5E72\u8106\u3002", gender: "\u5973", age: "\u5C11\u5E74", feature: "\u77ED\u4FC3\u9510\u5229" },
  { key: "\u5973-\u5C11\u5E74-\u6E29\u8F6F", text: "\u5C11\u5973\u6E29\u8F6F\uFF1A\u4E2D\u9891\u67D4\uFF0C\u6C14\u606F\u8FDE\u7EED\uFF0C\u53E5\u5C3E\u8F7B\u843D\uFF0C\u4EB2\u8FD1\u611F\u660E\u663E\u3002", gender: "\u5973", age: "\u5C11\u5E74", feature: "\u6E29\u8F6F" },
  { key: "\u5973-\u5C11\u5E74-\u51B7\u751C", text: "\u5C11\u5973\u51B7\u751C\uFF1A\u58F0\u7EBF\u6E05\u4EAE\u4F46\u60C5\u7EEA\u514B\u5236\uFF0C\u751C\u611F\u8F7B\uFF0C\u5C3E\u97F3\u5E72\u51C0\u6536\u4F4F\u3002", gender: "\u5973", age: "\u5C11\u5E74", feature: "\u51B7\u751C" },
  { key: "\u5973-\u5C11\u5E74-\u7AEF\u6B63\u6E05\u6670", text: "\u5C11\u5973\u7AEF\u6B63\u6E05\u6670\uFF1A\u53D1\u97F3\u6807\u51C6\uFF0C\u8BED\u901F\u7A33\uFF0C\u91CD\u97F3\u7406\u6027\uFF0C\u53E5\u6CD5\u5C42\u6B21\u6E05\u695A\u3002", gender: "\u5973", age: "\u5C11\u5E74", feature: "\u7AEF\u6B63\u6E05\u6670" },
  { key: "\u5973-\u9752\u5E74-\u660E\u4EAE\u5229\u843D", text: "\u9752\u5E74\u5973\u58F0\u660E\u4EAE\u5229\u843D\uFF1A\u9AD8\u9891\u660E\u4EAE\uFF0C\u8F85\u97F3\u5E72\u51C0\uFF0C\u53E5\u5C3E\u77ED\u4FC3\u6709\u5F39\u6027\uFF0C\u751C\u611F\u5F88\u8F7B\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u660E\u4EAE\u5229\u843D" },
  { key: "\u5973-\u9752\u5E74-\u8584\u51B7\u76F4\u58F0", text: "\u9752\u5E74\u5973\u58F0\u8584\u51B7\u76F4\u58F0\uFF1A\u58F0\u7EBF\u504F\u8584\u51B7\uFF0C\u6C14\u606F\u76F4\uFF0C\u6291\u626C\u5C11\uFF0C\u8FB9\u754C\u611F\u6E05\u695A\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u8584\u51B7\u76F4\u58F0" },
  { key: "\u5973-\u9752\u5E74-\u6C14\u58F0\u67D4\u7CEF", text: "\u9752\u5E74\u5973\u58F0\u6C14\u58F0\u67D4\u7CEF\uFF1A\u6C14\u58F0\u5305\u88F9\uFF0C\u97F3\u8272\u67D4\u7CEF\uFF0C\u5C3E\u97F3\u8F7B\u62D6\uFF0C\u4F9D\u8D56\u611F\u8F83\u5F3A\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u6C14\u58F0\u67D4\u7CEF" },
  { key: "\u5973-\u9752\u5E74-\u4F4E\u78C1\u6162\u58F0", text: "\u9752\u5E74\u5973\u58F0\u4F4E\u78C1\u6162\u58F0\uFF1A\u57FA\u9891\u7565\u4F4E\uFF0C\u4E2D\u4F4E\u9891\u6709\u9ECF\u6027\uFF0C\u5410\u5B57\u6162\u800C\u6709\u8D28\u611F\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u4F4E\u78C1\u6162\u58F0" },
  { key: "\u5973-\u9752\u5E74-\u4F4E\u8BED\u7559\u767D", text: "\u9752\u5E74\u5973\u58F0\u4F4E\u8BED\u7559\u767D\uFF1A\u97F3\u91CF\u6536\u655B\uFF0C\u505C\u987F\u7559\u767D\u591A\uFF0C\u5C3E\u97F3\u8F7B\u6C89\uFF0C\u53D9\u8FF0\u5E26\u6697\u7EBF\u611F\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u4F4E\u8BED\u7559\u767D" },
  { key: "\u5973-\u4E2D\u5E74-\u7A33\u538B\u6E05\u6670", text: "\u4E2D\u5E74\u5973\u58F0\u7A33\u538B\u6E05\u6670\uFF1A\u53D1\u58F0\u7A33\uFF0C\u91CD\u97F3\u4E0B\u538B\uFF0C\u53E5\u5C3E\u5E72\u51C0\uFF0C\u5410\u5B57\u6709\u63A7\u5236\u529B\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u7A33\u538B\u6E05\u6670" },
  { key: "\u5973-\u4E2D\u5E74-\u67D4\u539A\u6162\u58F0", text: "\u4E2D\u5E74\u5973\u58F0\u67D4\u539A\u6162\u58F0\uFF1A\u4E2D\u9891\u67D4\u539A\uFF0C\u8BED\u901F\u504F\u6162\uFF0C\u53E5\u95F4\u7559\u767D\u6E29\u6696\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u67D4\u539A\u6162\u58F0" },
  { key: "\u5973-\u4E2D\u5E74-\u5229\u843D\u53E3\u8BED", text: "\u4E2D\u5E74\u5973\u58F0\u5229\u843D\u53E3\u8BED\uFF1A\u53E3\u8BED\u5316\u5F3A\uFF0C\u8282\u594F\u5229\u843D\uFF0C\u8BED\u6C14\u76F4\u63A5\uFF0C\u751F\u6D3B\u611F\u6D53\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u5229\u843D\u53E3\u8BED" },
  { key: "\u5973-\u4E2D\u5E74-\u5706\u6DA6\u4F4E\u67D4", text: "\u4E2D\u5E74\u5973\u58F0\u5706\u6DA6\u4F4E\u67D4\uFF1A\u4F4E\u4E2D\u9891\u67D4\u548C\uFF0C\u5410\u5B57\u5706\u6DA6\uFF0C\u8BED\u901F\u4ECE\u5BB9\uFF0C\u5C3E\u97F3\u8F7B\u6536\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u5706\u6DA6\u4F4E\u67D4" },
  { key: "\u5973-\u4E2D\u5E74-\u6C14\u77ED\u4E0B\u6C89", text: "\u4E2D\u5E74\u5973\u58F0\u6C14\u77ED\u4E0B\u6C89\uFF1A\u6C14\u606F\u6D45\uFF0C\u5C3E\u97F3\u4E0B\u6C89\uFF0C\u8BED\u901F\u504F\u6162\uFF0C\u542C\u611F\u538B\u7740\u5026\u610F\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u6C14\u77ED\u4E0B\u6C89" },
  { key: "\u5973-\u8001\u5E74-\u4F4E\u67D4\u6162\u901F", text: "\u8001\u5E74\u5973\u58F0\u4F4E\u67D4\u6162\u901F\uFF1A\u4F4E\u4E2D\u9891\u67D4\u6696\uFF0C\u8BED\u901F\u6162\uFF0C\u5C3E\u97F3\u8F7B\u843D\uFF0C\u4EB2\u548C\u611F\u5F3A\u3002", gender: "\u5973", age: "\u8001\u5E74", feature: "\u4F4E\u67D4\u6162\u901F" },
  { key: "\u5973-\u8001\u5E74-\u5C16\u7EC6\u77ED\u4FC3", text: "\u8001\u5E74\u5973\u58F0\u5C16\u7EC6\u77ED\u4FC3\uFF1A\u9F7F\u97F3\u504F\u9510\uFF0C\u91CD\u97F3\u77ED\u786C\uFF0C\u5C3E\u97F3\u4E0A\u6311\u5E26\u6311\u5254\u611F\u3002", gender: "\u5973", age: "\u8001\u5E74", feature: "\u5C16\u7EC6\u77ED\u4FC3" },
  { key: "\u5973-\u8001\u5E74-\u98A4\u58F0", text: "\u8001\u5E74\u5973\u58F0\u98A4\u58F0\uFF1A\u58F0\u5E26\u677E\uFF0C\u5C3E\u97F3\u7EC6\u98A4\uFF0C\u505C\u987F\u591A\uFF0C\u60C5\u7EEA\u5BB9\u6613\u5916\u9732\u3002", gender: "\u5973", age: "\u8001\u5E74", feature: "\u98A4\u58F0" },
  { key: "\u5973-\u8001\u5E74-\u4E61\u97F3", text: "\u8001\u5E74\u5973\u58F0\u4E61\u97F3\uFF1A\u5B57\u8179\u5706\uFF0C\u5C40\u90E8\u53D1\u97F3\u6734\u7D20\uFF0C\u8BED\u6C14\u4EB2\u5207\u5E26\u5730\u65B9\u751F\u6D3B\u611F\u3002", gender: "\u5973", age: "\u8001\u5E74", feature: "\u4E61\u97F3" },
  { key: "\u5973-\u8001\u5E74-\u7F13\u7A33\u6E05\u6670", text: "\u8001\u5E74\u5973\u58F0\u7F13\u7A33\u6E05\u6670\uFF1A\u8282\u594F\u4ECE\u5BB9\uFF0C\u91CD\u97F3\u8F7B\u800C\u51C6\uFF0C\u53D9\u8FF0\u6709\u9605\u5386\u548C\u5224\u65AD\u529B\u3002", gender: "\u5973", age: "\u8001\u5E74", feature: "\u7F13\u7A33\u6E05\u6670" },
  { key: "\u7537-\u9752\u5E74-\u4EAC\u8154\u8F7B\u513F\u5316", text: "\u9752\u5E74\u7537\u58F0\u4EAC\u8154\u8F7B\u513F\u5316\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\uFF0C\u5C11\u91CF\u513F\u5316\u5C3E\u97F3\uFF0C\u53E5\u5C3E\u8F7B\u5377\uFF0C\u8282\u594F\u5229\u843D\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u4EAC\u8154\u8F7B\u513F\u5316" },
  { key: "\u7537-\u9752\u5E74-\u7CA4\u666E\u77ED\u4FC3", text: "\u9752\u5E74\u7537\u58F0\u7CA4\u666E\u77ED\u4FC3\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u7CA4\u8BED\u53E3\u97F3\uFF0C\u5E73\u7FD8\u820C\u5F31\u5316\uFF0C\u5165\u58F0\u611F\u77ED\u4FC3\uFF0C\u5C3E\u97F3\u6536\u5F97\u5FEB\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u7CA4\u666E\u77ED\u4FC3" },
  { key: "\u7537-\u9752\u5E74-\u5DDD\u6E1D\u4E0A\u626C", text: "\u9752\u5E74\u7537\u58F0\u5DDD\u6E1D\u4E0A\u626C\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u5DDD\u6E1D\u53E3\u97F3\uFF0C\u8BED\u5C3E\u8F7B\u4E0A\u626C\uFF0C\u8282\u594F\u660E\u5FEB\uFF0C\u54AC\u5B57\u5E26\u5F39\u6027\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u5DDD\u6E1D\u4E0A\u626C" },
  { key: "\u7537-\u9752\u5E74-\u897F\u5317\u539A\u8154", text: "\u9752\u5E74\u7537\u58F0\u897F\u5317\u539A\u8154\uFF1A\u80F8\u8154\u5171\u9E23\u539A\uFF0C\u5F00\u53E3\u97F3\u5BBD\uFF0C\u53E5\u5C3E\u4E0B\u538B\uFF0C\u8282\u594F\u786C\u6717\u76F4\u63A5\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u897F\u5317\u539A\u8154" },
  { key: "\u7537-\u9752\u5E74-\u4E1C\u5317\u8BDD", text: "\u9752\u5E74\u7537\u58F0\u4E1C\u5317\u8BDD\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u4E1C\u5317\u53E3\u97F3\uFF0C\u5F00\u53E3\u97F3\u504F\u5BBD\uFF0C\u53E5\u5C3E\u81EA\u7136\u4E0A\u626C\uFF0C\u8BED\u6C14\u76F4\u723D\u4F46\u4E0D\u8FC7\u5EA6\u5938\u5F20\u3002", gender: "\u7537", age: "\u9752\u5E74", feature: "\u4E1C\u5317\u8BDD" },
  { key: "\u5973-\u9752\u5E74-\u6C5F\u6D59\u8F6F\u8C03", text: "\u9752\u5E74\u5973\u58F0\u6C5F\u6D59\u8F6F\u8C03\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u504F\u6C5F\u6D59\u8F6F\u8C03\uFF0C\u4E2D\u9891\u67D4\uFF0C\u5C3E\u97F3\u8F7B\u8F6F\uFF0C\u8BED\u901F\u4ECE\u5BB9\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u6C5F\u6D59\u8F6F\u8C03" },
  { key: "\u5973-\u9752\u5E74-\u7CA4\u666E\u8F7B\u77ED", text: "\u9752\u5E74\u5973\u58F0\u7CA4\u666E\u8F7B\u77ED\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u7CA4\u8BED\u53E3\u97F3\uFF0C\u97F3\u5934\u6E05\u4EAE\uFF0C\u5C3E\u97F3\u77ED\u6536\uFF0C\u8BED\u6C14\u8F7B\u5DE7\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u7CA4\u666E\u8F7B\u77ED" },
  { key: "\u5973-\u9752\u5E74-\u5DDD\u6E1D\u5229\u843D", text: "\u9752\u5E74\u5973\u58F0\u5DDD\u6E1D\u5229\u843D\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u5DDD\u6E1D\u53E3\u97F3\uFF0C\u8BED\u5C3E\u8F7B\u626C\uFF0C\u77ED\u53E5\u5229\u843D\uFF0C\u60C5\u7EEA\u53CD\u5E94\u5FEB\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u5DDD\u6E1D\u5229\u843D" },
  { key: "\u5973-\u9752\u5E74-\u95FD\u5357\u5706\u8F6C", text: "\u9752\u5E74\u5973\u58F0\u95FD\u5357\u5706\u8F6C\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u95FD\u5357\u53E3\u97F3\uFF0C\u524D\u540E\u9F3B\u97F3\u7565\u5F31\uFF0C\u8BED\u8C03\u5706\u8F6C\uFF0C\u5C3E\u97F3\u8F7B\u6536\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u95FD\u5357\u5706\u8F6C" },
  { key: "\u5973-\u9752\u5E74-\u4E1C\u5317\u8BDD", text: "\u9752\u5E74\u5973\u58F0\u4E1C\u5317\u8BDD\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u4E1C\u5317\u53E3\u97F3\uFF0C\u5F00\u53E3\u97F3\u504F\u5BBD\uFF0C\u77ED\u53E5\u723D\u5229\uFF0C\u53E5\u5C3E\u8F7B\u5FAE\u4E0A\u626C\uFF0C\u751F\u6D3B\u611F\u76F4\u63A5\u81EA\u7136\u3002", gender: "\u5973", age: "\u9752\u5E74", feature: "\u4E1C\u5317\u8BDD" },
  { key: "\u7537-\u4E2D\u5E74-\u4E1C\u5317\u5BBD\u8154", text: "\u4E2D\u5E74\u7537\u58F0\u4E1C\u5317\u5BBD\u8154\uFF1A\u5F00\u53E3\u97F3\u5BBD\uFF0C\u80F8\u8154\u5171\u9E23\u8DB3\uFF0C\u53E5\u5C3E\u4E0A\u626C\u660E\u663E\uFF0C\u8282\u594F\u5927\u5F00\u5927\u5408\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u4E1C\u5317\u5BBD\u8154" },
  { key: "\u7537-\u4E2D\u5E74-\u4E2D\u539F\u5E73\u76F4", text: "\u4E2D\u5E74\u7537\u58F0\u4E2D\u539F\u5E73\u76F4\uFF1A\u4E2D\u9891\u539A\uFF0C\u54AC\u5B57\u5E73\u76F4\uFF0C\u5C3E\u97F3\u8F7B\u5760\uFF0C\u8BED\u6C14\u6734\u5B9E\u7A33\u5F53\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u4E2D\u539F\u5E73\u76F4" },
  { key: "\u7537-\u4E2D\u5E74-\u5C71\u4E1C\u539A\u55D3", text: "\u4E2D\u5E74\u7537\u58F0\u5C71\u4E1C\u539A\u55D3\uFF1A\u55D3\u97F3\u539A\u5B9E\uFF0C\u5F00\u53E3\u97F3\u5927\uFF0C\u91CD\u97F3\u843D\u5F97\u5B9E\uFF0C\u53E5\u5C3E\u5E72\u8106\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u5C71\u4E1C\u539A\u55D3" },
  { key: "\u7537-\u4E2D\u5E74-\u897F\u5357\u53E3\u97F3", text: "\u4E2D\u5E74\u7537\u58F0\u897F\u5357\u53E3\u97F3\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u897F\u5357\u53E3\u97F3\uFF0C\u5E73\u7FD8\u820C\u8F7B\u6DF7\uFF0C\u8BED\u6C14\u76F4\uFF0C\u5C3E\u97F3\u81EA\u7136\u4E0A\u626C\u3002", gender: "\u7537", age: "\u4E2D\u5E74", feature: "\u897F\u5357\u53E3\u97F3" },
  { key: "\u5973-\u4E2D\u5E74-\u4E1C\u5317\u723D\u6717", text: "\u4E2D\u5E74\u5973\u58F0\u4E1C\u5317\u723D\u6717\uFF1A\u5F00\u53E3\u97F3\u5BBD\uFF0C\u97F3\u91CF\u8F83\u8DB3\uFF0C\u8BED\u5C3E\u4E0A\u626C\uFF0C\u8282\u594F\u723D\u5FEB\u76F4\u63A5\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u4E1C\u5317\u723D\u6717" },
  { key: "\u5973-\u4E2D\u5E74-\u6C5F\u6DEE\u5E73\u5B9E", text: "\u4E2D\u5E74\u5973\u58F0\u6C5F\u6DEE\u5E73\u5B9E\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u6C5F\u6DEE\u53E3\u97F3\uFF0C\u54AC\u5B57\u6734\u7D20\uFF0C\u8BED\u901F\u4E2D\u7B49\uFF0C\u5C3E\u97F3\u5E73\u6536\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u6C5F\u6DEE\u5E73\u5B9E" },
  { key: "\u5973-\u4E2D\u5E74-\u5DDD\u6E1D\u660E\u5FEB", text: "\u4E2D\u5E74\u5973\u58F0\u5DDD\u6E1D\u660E\u5FEB\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u5DDD\u6E1D\u53E3\u97F3\uFF0C\u8BED\u8C03\u4E0A\u626C\uFF0C\u77ED\u53E5\u5E72\u8106\uFF0C\u751F\u6D3B\u611F\u5F3A\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u5DDD\u6E1D\u660E\u5FEB" },
  { key: "\u5973-\u4E2D\u5E74-\u7CA4\u666E\u5706\u77ED", text: "\u4E2D\u5E74\u5973\u58F0\u7CA4\u666E\u5706\u77ED\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u7CA4\u8BED\u53E3\u97F3\uFF0C\u5B57\u8179\u5706\uFF0C\u5C3E\u97F3\u77ED\u6536\uFF0C\u8BED\u6C14\u514B\u5236\u3002", gender: "\u5973", age: "\u4E2D\u5E74", feature: "\u7CA4\u666E\u5706\u77ED" },
  { key: "\u7537-\u8001\u5E74-\u5317\u65B9\u4E61\u97F3", text: "\u8001\u5E74\u7537\u58F0\u5317\u65B9\u4E61\u97F3\uFF1A\u55D3\u97F3\u6C99\u539A\uFF0C\u513F\u5316\u8F7B\uFF0C\u5F00\u53E3\u97F3\u5BBD\uFF0C\u53E5\u5C3E\u81EA\u7136\u4E0B\u5760\u3002", gender: "\u7537", age: "\u8001\u5E74", feature: "\u5317\u65B9\u4E61\u97F3" },
  { key: "\u7537-\u8001\u5E74-\u6C5F\u5357\u8F6F\u97F3", text: "\u8001\u5E74\u7537\u58F0\u6C5F\u5357\u8F6F\u97F3\uFF1A\u4E2D\u9891\u67D4\uFF0C\u8BED\u901F\u6162\uFF0C\u5C3E\u97F3\u8F6F\u843D\uFF0C\u53E3\u97F3\u8F7B\u800C\u4E0D\u5938\u5F20\u3002", gender: "\u7537", age: "\u8001\u5E74", feature: "\u6C5F\u5357\u8F6F\u97F3" },
  { key: "\u5973-\u8001\u5E74-\u5434\u8BED\u8F6F\u97F3", text: "\u8001\u5E74\u5973\u58F0\u5434\u8BED\u8F6F\u97F3\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u5434\u8BED\u8F6F\u97F3\uFF0C\u58F0\u7EBF\u67D4\uFF0C\u5C3E\u97F3\u8F7B\u8F6F\uFF0C\u8BED\u6C14\u6E29\u548C\u3002", gender: "\u5973", age: "\u8001\u5E74", feature: "\u5434\u8BED\u8F6F\u97F3" },
  { key: "\u5973-\u8001\u5E74-\u95FD\u5357\u4E61\u97F3", text: "\u8001\u5E74\u5973\u58F0\u95FD\u5357\u4E61\u97F3\uFF1A\u666E\u901A\u8BDD\u5E95\u8272\u5E26\u95FD\u5357\u4E61\u97F3\uFF0C\u8BED\u8C03\u5706\u8F6C\uFF0C\u9F3B\u97F3\u5F31\u5316\uFF0C\u53E5\u5C3E\u77ED\u6536\u3002", gender: "\u5973", age: "\u8001\u5E74", feature: "\u95FD\u5357\u4E61\u97F3" }
];
var VOICE_DIALECT_PRESET_MARKER_RE = /(?:乡音|京腔|粤普|川渝|西北|东北|江浙|闽南|中原|山东|西南口音|江淮|江南软音|吴语|四川话|粤语|天津话|上海话|陕西话|河南话|台湾腔|方言|口音)/u;
var isVoiceDescriptionDialectPreset = (preset) => VOICE_DIALECT_PRESET_MARKER_RE.test(`${preset.key} ${preset.feature} ${preset.text}`);
var VOICE_DESCRIPTION_FEATURE_PRESET_EXTRAS = VOICE_DESCRIPTION_PRESET_EXTRAS.filter((preset) => !isVoiceDescriptionDialectPreset(preset));

// services/characterStylingAiService.ts
var EXPORT_MARKET_APPEARANCE_TEMPLATE_BY_REGION = {
  us: [
    "US appearance template pool: use a believable American cast mix instead of default East Asian faces.",
    "Face options include Caucasian angular oval faces, Black American warm deep-feature faces, Latino/mixed-American cheekbone structure, and broad American business-drama faces.",
    "Hair options include blonde, light brown, chestnut, dark brown, auburn, textured curls, layered waves, pixie/bob cuts, loose ponytails, and natural Black hairstyles where appropriate.",
    "Body options include athletic, tall tailored, curvy professional, compact office-worker, and realistic middle-aged silhouettes."
  ].join(" "),
  latam: [
    "Latin America appearance template pool: use Latin American mestizo, Afro-Latin, and European-Latin visual variety instead of default East Asian faces.",
    "Face options include warm olive/tan skin, pronounced cheekbones, expressive eyes, fuller lips, strong brows, and family-drama recognizable faces.",
    "Hair options include dark brown, black-brown, auburn, honey brown, dense waves, long layers, polished blowouts, textured curls, and practical tied-back styles.",
    "Body options include curvy, athletic, compact, mature family-drama, and polished professional silhouettes."
  ].join(" "),
  india: [
    "India appearance template pool: use Indian/South Asian visual identity instead of default East Asian faces.",
    "Face options include brown skin tones, almond or deep-set eyes, strong brows, defined nose bridge, oval/round/heart faces, and expressive family-drama faces.",
    "Hair options include black or dark brown thick hair, long waves, low buns, side-part waves, braids, loose curls, and professional tied-back styles.",
    "Body options include slender, athletic, curvy, mature family-drama, and professional silhouettes with South Asian wardrobe logic when the role requires it."
  ].join(" ")
};
var CHARACTER_STYLING_VOICE_PRESET_GUIDE = makePromptToken("styling.voice_preset_guide");

// services/characterStylingCatalogService.ts
init_appVersionHeaders();
init_relayProviderConfig();
init_relayAuthService();
var CATALOG_CACHE_MS = 5 * 60 * 1e3;

// services/storyboardAgentWorkflow.ts
init_assetPromptQuality();
init_utils();
init_voiceOnlyAssets();
var BRACKET_TAG_RE = /\[[^\]\n]+\]/g;
var DURATION_TAG_RE = /^\[\s*(?:\d+(?:\.\d+)?s|\u65f6\u957f\s*\d+(?:\.\d+)?\s*\u79d2)\s*\]$/i;
var SCENE_ASSET_VARIANT_TOKEN = "(?:day|night|morning|evening|dawn|dusk|sunny|rainy|cloudy|\\u767d\\u5929|\\u591c|\\u591c\\u665a|\\u665a\\u4e0a|\\u591c\\u95f4|\\u6df1\\u591c|\\u51cc\\u6668|\\u6e05\\u6668|\\u65e9\\u6668|\\u4e0a\\u5348|\\u4e2d\\u5348|\\u5348\\u540e|\\u4e0b\\u5348|\\u9ec4\\u660f|\\u508d\\u665a|\\u6674\\u5929|\\u9634\\u5929|\\u96e8\\u5929|\\u6674\\u6717|\\u9634\\u6c89|\\u660e\\u4eae|\\u660f\\u6697|\\u51b7\\u5149|\\u6696\\u5149|\\u9006\\u5149|\\u987a\\u5149|\\u9876\\u5149|\\u4fa7\\u5149|\\u81ea\\u7136\\u5149|\\u591c\\u666f)";
var SCENE_ASSET_VARIANT_SUFFIX_RE = new RegExp(`(?:[\\s,_\\-\\/|\\u2014\\u2013\\uff5c]*${SCENE_ASSET_VARIANT_TOKEN})+$`, "iu");
var SCENE_ASSET_VARIANT_PAREN_RE = new RegExp(`(?:\\s*[\\uff08(]\\s*${SCENE_ASSET_VARIANT_TOKEN}\\s*[\\uff09)])+$`, "iu");
var CONTROL_TAGS = /* @__PURE__ */ new Set([
  "[POV]",
  "[DutchAngle]",
  "[LongTake]",
  "[OneTake]",
  "[SlowMotion]",
  "[Blackout]",
  "[FadeIn]",
  "[FadeOut]",
  "[Flashback]",
  "[Cutaway]",
  "[\u4E00\u955C\u5230\u5E95]",
  "[\u957F\u955C\u5934]",
  "[\u6162\u52A8\u4F5C]",
  "[\u9ED1\u573A]",
  "[\u6DE1\u5165]",
  "[\u6DE1\u51FA]",
  "[\u95EA\u767D]",
  "[\u95EA\u56DE]",
  "[\u56DE\u5FC6\u955C\u5934]",
  "[\u8054\u60F3\u955C\u5934]",
  "[\u7A7A\u955C]",
  "[\u8FC7\u80A9\u955C\u5934]"
]);
var isControlTag = (tag) => CONTROL_TAGS.has(tag) || DURATION_TAG_RE.test(tag);
var extractTags = (value) => Array.from(String(value || "").match(BRACKET_TAG_RE) || []);
var validateStoryboardAgainstEpisodeUsage = (script, usage) => {
  const issues = [];
  const allowedCharacters = new Set(usage.characterTags);
  const allowedScenes = new Set(usage.sceneTags);
  const allowedAll = /* @__PURE__ */ new Set([...usage.characterTags, ...usage.sceneTags, ...usage.propTags]);
  const shots = parseTaskIntoShots(String(script || ""));
  shots.forEach((shot) => {
    const shotLabel = String(shot.shotNumber || "").trim() || "SHOT";
    extractTags(shot.charactersInShot).forEach((tag) => {
      const voiceCanonical = getVoiceOnlyCharacterCanonicalTag(tag);
      if (voiceCanonical === null) return;
      if (voiceCanonical && allowedCharacters.has(voiceCanonical)) return;
      if (!isControlTag(tag) && !allowedCharacters.has(tag)) {
        issues.push(`SHOT ${shotLabel} uses unknown character tag: ${tag}`);
      }
    });
    const sceneText = String(shot.scene || "").trim();
    const sceneTags = extractTags(sceneText).filter((tag) => !isVoiceOnlyPropSceneTag(tag) && !isControlTag(tag));
    let hasAllowedSceneTag = false;
    sceneTags.forEach((tag) => {
      if (isVoiceOnlyPropSceneTag(tag)) return;
      if (allowedScenes.has(tag)) {
        hasAllowedSceneTag = true;
        return;
      }
      if (!isControlTag(tag)) {
        issues.push(`SHOT ${shotLabel} uses unknown scene tag: ${tag}`);
      }
    });
    if (allowedScenes.size > 0 && !hasAllowedSceneTag) {
      issues.push(`SHOT ${shotLabel} missing allowed scene tag in scene field: ${sceneText.slice(0, 220) || "(empty)"}`);
    } else if (allowedScenes.size === 0 && sceneText) {
      issues.push(`SHOT ${shotLabel} missing scene catalog for scene field: ${sceneText.slice(0, 220)}`);
    }
    ["action", "prompt", "dialogue", "sfx", "FirstFrame", "LastFrame", "transitionPrompt"].forEach((field) => {
      extractTags(String(shot[field] || "")).forEach((tag) => {
        if (isControlTag(tag)) return;
        const voiceCanonical = getVoiceOnlyCharacterCanonicalTag(tag);
        if (voiceCanonical === null) return;
        if (voiceCanonical && allowedCharacters.has(voiceCanonical)) return;
        if (!allowedAll.has(tag)) {
          issues.push(`SHOT ${shotLabel} field ${field} uses unknown tag: ${tag}`);
        }
      });
    });
  });
  return issues;
};

// services/episodeAssetAuthority.ts
init_utils();
var tags = (text) => Array.from(String(text || "").matchAll(/[\[\u3010]([^\[\]\u3010\u3011\n]+)[\]\u3011]/g), (match) => `[${match[1].trim()}]`);
var fields = ["charactersInShot", "action", "prompt", "FirstFrame", "LastFrame"];
function auditEpisodeAssetAuthority(shots, plan, sceneMap = []) {
  const issues = validateStoryboardAgainstEpisodeUsage(serializeShotsToTaskScript(shots), plan.episodeUsage);
  const selected = new Set(plan.episodeUsage.characterTags);
  const knownCharacterTags = new Set([...plan.characters, ...plan.authorityCharacters || []].map((c4) => c4.name));
  const byTag = new Map(plan.characters.filter((c4) => selected.has(c4.name)).map((c4) => [c4.name, c4]));
  const roleOf = (tag) => {
    const c4 = byTag.get(tag);
    return c4?.roleKey || c4?.entityId || c4?.identityKey || "";
  };
  for (const shot of shots) {
    const usedByRole = /* @__PURE__ */ new Map();
    const declared = new Set(tags(shot.charactersInShot));
    const prompt = String(shot.prompt || "");
    const promptTags = new Set(tags(prompt));
    if (prompt.trim()) for (const tag of declared) {
      if (!knownCharacterTags.has(tag) || promptTags.has(tag)) continue;
      const character = byTag.get(tag);
      const baseName = String(character?.baseCharacterName || tag.replace(/^[\[【]|[\]】]$/g, "").split("-")[0]);
      if (baseName && prompt.includes(baseName)) continue;
      issues.push(`SHOT ${shot.shotNumber} field prompt declared character not referenced; AI must review visible subject: ${tag}`);
    }
    for (const field of fields) {
      const text = String(shot[field] || "");
      if (/[\[【][^\]】\n]*(?:$|\n)/.test(text)) issues.push(`SHOT ${shot.shotNumber} field ${field} unclosed asset tag requires AI repair`);
      const bareText = String(shot[field] || "").replace(/[\[\u3010][^\[\]\u3010\u3011\n]*[\]\u3011]/g, " ");
      for (const tag of knownCharacterTags) {
        const label = tag.replace(/^[\[\u3010]|[\]\u3011]$/g, "");
        if (label && bareText.includes(label)) issues.push(`SHOT ${shot.shotNumber} field ${field} bare character reference requires source/cast review: ${tag}`);
      }
      for (const match of bareText.matchAll(/[\u3400-\u9fff]{2,8}[-\u2013\u2014][\u3400-\u9fff]{1,12}/g)) {
        issues.push(`SHOT ${shot.shotNumber} field ${field} unbracketed appearance-like text requires AI identity review: ${match[0]}`);
      }
      for (const tag of tags(shot[field])) {
        if (field !== "charactersInShot" && knownCharacterTags.has(tag) && !declared.has(tag)) issues.push(`SHOT ${shot.shotNumber} field ${field} character absent from charactersInShot: ${tag}`);
        const role = roleOf(tag);
        if (!role) continue;
        const used = usedByRole.get(role) || /* @__PURE__ */ new Set();
        used.add(tag);
        usedByRole.set(role, used);
      }
    }
    for (const [role, used] of usedByRole) {
      if (used.size > 1) issues.push(`SHOT ${shot.shotNumber} conflicting appearances for role ${role}: ${[...used].join(", ")}`);
      const sceneTags = new Set(tags(shot.scene));
      const mapped = new Set(sceneMap.filter((row) => sceneTags.has(row.sceneTag || "")).flatMap((row) => (row.characters || []).filter((c4) => c4.roleKey === role).map((c4) => c4.characterTag)).filter((tag) => selected.has(tag)));
      if (mapped.size === 1) {
        for (const tag of used) if (!mapped.has(tag)) issues.push(`SHOT ${shot.shotNumber} scene appearance mismatch for role ${role}: ${tag}; selected ${[...mapped][0]}`);
      }
    }
  }
  return [...new Set(issues)];
}

// storyboard-audit-entry.ts
function auditProjectStoryboard(project) {
  const characters = project.characters || [];
  const scenes = [...project.scenes || [], ...(project.props || []).filter((x) => x.subtype === "scene")];
  const props = (project.props || []).filter((x) => x.subtype !== "scene");
  const catalog = buildRefLockCatalog({ characters, scenes, props });
  const usage = { characterTags: characters.map((c4) => c4.name), sceneTags: scenes.map((s) => s.name), propTags: props.map((x) => x.name) };
  const plan = { characters, authorityCharacters: [], scenes, props, episodeUsage: usage, allowedUsage: usage, warnings: [], notes: [], physicalLocationAudit: [] };
  const sceneMap = project.assetBible?.sceneAppearanceMap || [];
  const out = [];
  (project.data || []).forEach((task, i) => {
    const shots = parseTaskIntoShots(String(task.script || ""));
    for (const r of auditShotReferences(shots, catalog)) {
      const shot = shots[r.shotIndex]?.shotNumber || r.shotIndex + 1;
      for (const t of r.invalidTags) out.push({ task: i, shot, kind: "invalid-tag", detail: t });
      for (const t of r.castNonCharacter) out.push({ task: i, shot, kind: "cast-not-character", detail: t });
      for (const t of r.sceneNonScene) out.push({ task: i, shot, kind: "scene-not-scene", detail: t });
      for (const t of r.propsNonProp) out.push({ task: i, shot, kind: "prop-not-prop", detail: t });
    }
    for (const issue of auditEpisodeAssetAuthority(shots, plan, sceneMap)) out.push({ task: i, shot: (issue.match(/^SHOT (\S+)/) || [])[1] || "", kind: "authority", detail: issue });
  });
  return out;
}
export {
  auditProjectStoryboard,
  parseTaskIntoShots
};
