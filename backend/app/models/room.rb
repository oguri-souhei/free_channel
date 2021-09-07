class Room < ApplicationRecord
  include RoomsHelper

  belongs_to :user

  validates :name, presence: true, length: { maximum: 300 }
  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :category, presence: true, inclusion: { in: CATEGORIES }

  def self.search_by_name(term)
    Room.where('name LIKE ?', '%' + term + '%')
  end

  def self.search_by_category(term, page = 1)
    Room.where(category: term)
  end
end
