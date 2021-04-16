from django.core.urlresolvers import reverse_lazy
from rest_framework import serializers
from contracts import models


class ContractsActiveSerializer(serializers.ModelSerializer):

    createdon = serializers.DateTimeField(format='%d.%m.%Y')
    download = serializers.SerializerMethodField()
    download_ru = serializers.SerializerMethodField()
    download_en = serializers.SerializerMethodField()
    send_to_email = serializers.SerializerMethodField()
    download_contract_bill_ru = serializers.SerializerMethodField()
    download_contract_bill_en = serializers.SerializerMethodField()
    invoice = serializers.SerializerMethodField()

    class Meta:
        model = models.Contract
        fields = 'id', 'createdon', 'status', 'download', "download_ru", "download_en", 'send_to_email', 'download_contract_bill_ru', 'download_contract_bill_en', \
                 'contract_is_payed', 'invoice', 'invoice_is_signed', 'invoice_is_payed',
        read_only_fields = 'contract_is_payed', 'invoice', 'invoice_is_signed', 'invoice_is_payed',

    def get_invoice(self, obj):
        if obj.invoice_is_signed and obj.invoice:
            return "%s://%s/api%s" % (self.context['request'].scheme,
                                  self.context['request'].get_host(),
                reverse_lazy('download_contract_invoice',
                                        args=[obj.pk,
                                              self.context['request'].user.auth_token]
                             ))

    def get_download(self, obj):
        return "%s://%s/api%s" % (self.context['request'].scheme,
                              self.context['request'].get_host(),
            reverse_lazy('download_contract',
                                    args=[obj.pk,
                                          self.context['request'].user.auth_token,
                                          "ru"]
                              ))

    def get_download_ru(self, obj):
        return "%s://%s/api%s" % (self.context['request'].scheme,
                              self.context['request'].get_host(),
            reverse_lazy('download_contract',
                                    args=[obj.pk,
                                          self.context['request'].user.auth_token,
                                          "ru"]
                              ))

    def get_download_en(self, obj):
        return "%s://%s/api%s" % (self.context['request'].scheme,
                              self.context['request'].get_host(),
            reverse_lazy('download_contract',
                                    args=[obj.pk,
                                          self.context['request'].user.auth_token,
                                          "en"]
                              ))

    def get_download_contract_bill_ru(self, obj):
        return "%s://%s/api%s" % (self.context['request'].scheme,
                              self.context['request'].get_host(),
            reverse_lazy('download_contract_bill',
                                    args=[obj.pk,
                                          self.context['request'].user.auth_token]
                              ))

    def get_download_contract_bill_en(self, obj):
        return "%s://%s/api%s" % (self.context['request'].scheme,
                              self.context['request'].get_host(),
            reverse_lazy('download_contract_bill_en',
                                    args=[obj.pk,
                                          self.context['request'].user.auth_token]
                              ))


    def get_send_to_email(self, obj):
        return "%s://%s/api%s" % (self.context['request'].scheme,
                              self.context['request'].get_host(),
                              reverse_lazy('api_v0:contract_email',
                                           args=[obj.pk]
                                           ))