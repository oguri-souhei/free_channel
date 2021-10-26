require 'rails_helper'

RSpec.describe 'Application', type: :request do
  context 'GET /health' do
    before do
      get health_path
    end

    it 'responds :ok' do
      expect(response).to have_http_status :ok
    end

    it 'renders json' do
      expect(response).to have_content_type :json
    end
  end
end
