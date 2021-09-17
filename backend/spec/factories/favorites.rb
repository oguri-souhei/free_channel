FactoryBot.define do
  factory :favorite do
    association :user
    association :comment
  end
end
