sap.ui.define([
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.inventory.frontend.controller.MainView", {
            onInit: async function () {
                // const teste = await new Promise(resolve => 
                //     this.getModel().read(`/Fornecedor`, {
                //       urlParameters: {
                //         $top: '1'
                //       },
                //       success: oData => resolve(oData.results ? oData.results[0] : [])
                //     })
                //   );
                // console.log(teste,"Carregou")
            }
        });
    });
