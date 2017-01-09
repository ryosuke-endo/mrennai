FactoryGirl.define do
  factory :category do
    id 1
    name "ニュース"
    description "恋愛に関する相談を行う場所です"
    position 1
    image File.new("#{Rails.root}/spec/fixtures/image/1.jpg")
  end
end
