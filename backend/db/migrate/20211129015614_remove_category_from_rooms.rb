class RemoveCategoryFromRooms < ActiveRecord::Migration[6.0]
  def change
    remove_column :rooms, :category, :string
  end
end
