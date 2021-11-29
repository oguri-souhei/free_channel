FactoryBot.define do
  factory :room do
    theme { 'Test room' }
    category { 'プログラミング' }
    association :user
  end

  factory :new_room, class: 'Room' do
    theme { 'New room' }
    category { 'スポーツ' }
    association :user
  end
end
