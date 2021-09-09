class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :room

  validates :sentence, presence: true, length: { maximum: 1000 }
  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :room_id, presence: true, numericality: { only_integer: true }
end
