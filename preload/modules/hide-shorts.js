const configManager = require('../config')
const jsonMod = require('../util/jsonModifiers')
const config = configManager.get()

module.exports = () => {
    if (!config.hide_shorts) return;

    jsonMod.addModifier((json) => {
        // Remove shorts from initial home page load
        const browseSections = json?.contents?.tvBrowseRenderer?.content?.
            tvSurfaceContentRenderer?.content?.sectionListRenderer;
        if (browseSections?.contents) {
            browseSections.contents = browseSections.contents.filter(
                (section) => section.shelfRenderer?.tvhtml5ShelfRendererType !== 'TVHTML5_SHELF_RENDERER_TYPE_SHORTS'
            );
        }

        // Remove shorts from continuation loads on home page
        const homeContinuation = json?.continuationContents?.sectionListContinuation;
        if (homeContinuation?.contents) {
            homeContinuation.contents = homeContinuation.contents.filter(
                (section) => section.shelfRenderer?.tvhtml5ShelfRendererType !== 'TVHTML5_SHELF_RENDERER_TYPE_SHORTS'
            );
        }

        // Remove shorts from subscriptions page
        // the initial payload of the subscriptions page includes shorts shelf for all subscriptions
        // but that data is requested again when the user navigates to the channels tab as a continuation
        // so we only need to remove the shorts from the initial payload to minimize the impact of filtering
        const subscriptionSections = json?.contents?.tvBrowseRenderer?.content?.tvSecondaryNavRenderer?.
            sections?.at(0)?.tvSecondaryNavSectionRenderer?.tabs?.at(0)?.tabRenderer?.content?.
            tvSurfaceContentRenderer?.content?.sectionListRenderer;

        if (subscriptionSections?.contents) {
            subscriptionSections.contents = subscriptionSections.contents.filter(
                (section) => section.shelfRenderer?.tvhtml5ShelfRendererType !== 'TVHTML5_SHELF_RENDERER_TYPE_SHORTS'
            );
        }

        // Remove continuation shorts from subscriptions page
        const subscriptionContinuation = json?.continuationContents?.tvSurfaceContentContinuation?.
            content?.sectionListRenderer;

        if (subscriptionContinuation?.contents) {
            subscriptionContinuation.contents = subscriptionContinuation.contents.filter(
                (section) => section.shelfRenderer?.tvhtml5ShelfRendererType !== 'TVHTML5_SHELF_RENDERER_TYPE_SHORTS'
            );
        }

        return json;
    });
};