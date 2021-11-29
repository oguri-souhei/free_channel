class AddOpinion1ToRooms < ActiveRecord::Migration[6.0]
  def change
    add_column :rooms, :opinion_1, :string
  end
end
