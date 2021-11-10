using {inventory.db.schema as Schema} from '../db/schema';


service Inventory {

entity Fornecedor as projection on Schema.Fornecedor;
entity Marca as projection on Schema.Marca;
entity Categoria as projection on Schema.Categoria;
entity Produto as projection on Schema.Produto;

entity Compra as projection on Schema.Compra;
entity ItemCompra as projection on Schema.ItemCompra;

entity Venda as projection on Schema.Venda;
entity ItemVenda as projection on Schema.ItemVenda;
    

}