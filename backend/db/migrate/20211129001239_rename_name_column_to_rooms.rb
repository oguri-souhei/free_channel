class RenameNameColumnToRooms < ActiveRecord::Migration[6.0]
  def change
    rename_column :rooms, :name, :theme
  end
end
