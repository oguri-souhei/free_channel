# expect(response).to have_content_type :json
RSpec::Matchers.define :have_content_type do |type|
  match do |response|
    if type == :json && response.content_type == 'application/json; charset=utf-8'
      true
    elsif type = :html && response.content_type == 'text/html; charset=utf-8'
      true
    else
      false
    end
  end
end
