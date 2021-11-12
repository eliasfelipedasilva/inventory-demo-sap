const cds = require('@sap/cds');

const {Fornecedor, Categoria, Marca, Produto, Compra, ItemCompra, ItemVenda, Venda} = cds.entities('inventory.db.schema');

module.exports = class  inventoryService extends cds.ApplicationService {
    async init(){
        this.after(['CREATE', 'UPDATE'], 'Compra', this.ajustar_valores_calculados);
        await super.init();
    }

    async ajustar_valores_calculados(req){

        //sempre buscar os items da compra separado da requisicao para quando nao vier os dados de items
        // realizar os calculos da mesma forma !!
        const items = await SELECT.from(ItemCompra).where({"compra_ID": req.ID})


        // inicio funcoes de calculos
        const total_compra = await this.calcular_valor_total_compra(items);
        const aQtd_estoque_produtos = await this.calcular_qtd_estoque(items);
        console.log(total_compra, aQtd_estoque_produtos) // depois de pegar todos os valores atualizar no banco 

        //fim funcoes de calculos

    }

    async calcular_valor_total_compra(items){
        let total_compra=0.00;
        items.map((item) =>{
            total_compra = total_compra +  (item.qtd * item.preco)
        });
        return total_compra;
    }

    async calcular_qtd_estoque(itemsCompra){
        const lista_distinta_produtos = [...new Set(itemsCompra.map(item => item.produto_ID))];
        let aEstoquePodutos = [];
        
        lista_distinta_produtos.map((item_id_produto)=>{
            let lista_de_items_do_produto =    itemsCompra.filter((item) =>{
                if(item_id_produto === item.produto_ID)
                return true;
            });

            let total_estoque_produto = 0;
            lista_de_items_do_produto.map((item)=>{
                 total_estoque_produto = total_estoque_produto+  item.qtd
            })
            aEstoquePodutos.push({
                produto_ID : item_id_produto,
                total_estoque_produto
            })
 
        });
        return aEstoquePodutos;

    }
}