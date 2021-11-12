const cds = require('@sap/cds');

const {Fornecedor, Categoria, Marca, Produto, Compra, ItemCompra, ItemVenda, Venda} = cds.entities('inventory.db.schema');

module.exports = class  inventoryService extends cds.ApplicationService {
    async init(){
        this.after(['CREATE', 'UPDATE'], 'Compra', this.ajustar_qtd_estoque);
        await super.init();
    }

    async ajustar_qtd_estoque(req){
        const compra = req;
        console.log(compra)
        // if(Array.isArray(compra.item_compra_ID))
        
        // pegar todos os items de compras
        const items_compra = await  SELECT.from(ItemCompra).where({"ID": compra.items_compra_ID})
        console.log(items_compra)
        //ajutar valor de estoque

    }
}