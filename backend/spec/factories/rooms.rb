FactoryBot.define do
  factory :room do
    theme { 'Test room' }
    description { 'これは部屋の説明です。' }
    opinion_1 { 'Ruby派' }
    opinion_2 { 'PHP派' }
    association :user
  end

  factory :new_room, class: 'Room' do
    theme { 'New room' }
    description { '新しい部屋の説明です。' }
    opinion_1 { 'Go派' }
    opinion_2 { 'Python派' }
    association :user
  end
end
