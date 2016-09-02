module.exports = 
{
    /**
     * Populate given <select> with limbs from model
     * 
     * @param {HTMLSelectElement} select
     * @param {Model} model
     */
    populateLimbs: function(select, model)
    {
        model.limbs.forEach(function (limb) {
            var option = document.createElement("option");
            
            option.value = option.text = limb.id;
            
            select.appendChild(option);
        });
    }
};