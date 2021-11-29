class AddDescriptionToRoom < ActiveRecord::Migration[6.0]
  def change
    add_column :rooms, :description, :text
  end
end
