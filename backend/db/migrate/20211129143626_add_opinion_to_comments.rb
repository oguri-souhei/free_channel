class AddOpinionToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :opinion, :integer, default: 0
  end
end
