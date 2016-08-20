/**
 * DOOM helpers
 * 
 * Some old helpers from other projects
 */

module.exports =
{
    /**
     * Select one element
     */
    $: function(selector, reference)
    {
        return (reference || document).querySelector(selector);
    },

    /**
     * Select multiple elements and create array out of them
     */
    $$: function(selector, reference)
    {
        return Array.prototype.slice.call(
            (reference || document).querySelectorAll(selector)
        );
    },

    /**
     * Shortcut for binding event listener on the event
     */
    on: function(node, event, listener)
    {
        node.addEventListener(event, listener);
    }
};