class CreatePlayers < ActiveRecord::Migration[8.0]
  def change
    create_table :players do |t|
      t.string :name
      t.integer :rubies, default: 0
      t.integer :pickaxe, default: 1
      t.integer :fortune, default: 0
      t.integer :efficiency, default: 0

      t.timestamps
    end
  end
end
