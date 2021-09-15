class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :comment

  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :comment_id, presence: true, numericality: { only_integer: true }
end
