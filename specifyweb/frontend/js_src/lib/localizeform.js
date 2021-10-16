"use strict";

var $ = require('jquery');

var props              = require('./props.js');
var schema             = require('./schema.js');
var stringLocalization = require('./stringlocalization.js');


    function localize(s) {
        return stringLocalization.localizeFrom(['views', 'global_views'], s);
    }

    function getControlFieldName(control) {
        return control.attr('name') ||
            control.closest('[data-specify-field-name]').data('specify-field-name');
    }

module.exports = function(formNode) {
        var form = $(formNode);
        var model = schema.getModel(form.data('specify-model'));
        if (!model) return;

        $('.specify-form-header', form).prepend(
            $('<h2>').text(model.getLocalizedName())
        );

        var fillinLabel = function() {
            var label = $('label', this);
            const setText = (text) => {
              label.text(text);
              if(text.trim().length===0)
                this.setAttribute('aria-hidden','true');
            }
            if (label.text()) {
                // the label was hard coded in the form
                setText(localize(label.text()));
                return;
            }
            var forId = label.prop('for');
            if (!forId){
              // not much we can do about that
              setText('');
              return;
            }
            var control = $('#' + forId, form);
            var override = control.data('specify-field-label-override');
            if (override !== undefined) {
                setText(localize(override));
                return;
            }
            var fieldname = getControlFieldName(control);
            if (!fieldname) return; // probably a label for a plugin
            var field = model.getField(fieldname);
            field && setText(field.getLocalizedName());
            var title = field && field.getLocalizedDesc();
            if(title && title !== label.text())
              label.attr('title', title);
        };

        if ($('.specify-formtable', form).length) {
            $('th', form).each(fillinLabel);
        } else {
            $('.specify-form-label', form).each(fillinLabel);

            $('.specify-field:checkbox', form).each(function() {
                fillinLabel.apply($(this).parent());
            });

            $('.specify-field', form).each(function() {
                var control = $(this);
                var fieldName = getControlFieldName(control);
                if (fieldName) {
                    var field = model.getField(fieldName);
                    if (field && field.isRequiredBySchemaLocalization())
                        control[0].required = true;
                } else {
                    console.error("control without name", this);
                }
            });
        }

        $('.specify-subview-header', form).each(function() {
            var fieldname = $(this).parent().data('specify-field-name');
            var label = model.getField(fieldname).getLocalizedName();
            $('.specify-subview-title', this).text(label);
        });
    };
