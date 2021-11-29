class AddOpinion2ToRooms < ActiveRecord::Migration[6.0]
  def change
    add_column :rooms, :opinion_2, :string
  end
end
