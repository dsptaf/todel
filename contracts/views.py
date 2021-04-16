from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.core.urlresolvers import reverse_lazy
from rest_framework import generics
from rest_framework.response import Response

from api.v0.auth.serializers import UserSerializerRead
from api.v0.common.mixins import CommonPermissions
from django.utils.translation import ugettext_lazy as _

from api.v0.contracts import serializers
from contracts import models
from contracts.utils import generate_contract
User = get_user_model()


class Contract(CommonPermissions, generics.GenericAPIView):

    email = False

    def get_result(self, contract, user):
        return {'success': True,
              'download': reverse_lazy('download_contract',
                                       args=[contract.pk,
                                             user.auth_token, 'ru']
                                       ),
              'download_ru': reverse_lazy('download_contract',
                                       args=[contract.pk,
                                             user.auth_token, 'ru']
                                       ),
              'download_en': reverse_lazy('download_contract',
                       args=[contract.pk,
                             user.auth_token, 'en']
                       ),
              'download_contract_bill_ru': reverse_lazy('download_contract_bill',
                                       args=[contract.pk,
                                             user.auth_token]
                                       ),
              'download_contract_bill_en': reverse_lazy('download_contract_bill_en',
                                       args=[contract.pk,
                                             user.auth_token]
                                       ),
              'id': contract.pk
          }

    def get(self, request, *args, **kwargs):
        if 'pk' in self.kwargs.keys():
            contract = models.Contract.objects.get(pk=self.kwargs['pk'],
                        organization=request.user.organization_managed)
            result = self.get_result(contract, request.user)
            return Response(result)
        else:
            already_in_contract = []
            contracts = models.Contract.objects.filter(
                            organization=request.user.organization_managed
                    )
            for contract in contracts:
                for pk in contract.participants.values_list('pk', flat=True):
                    already_in_contract.append(pk)
            users = User.objects.filter(organization=request.user.organization_managed) \
                .exclude(pk__in=already_in_contract).exclude(is_hidden=True).exclude(is_free=True)
            return Response(
                UserSerializerRead(users, many=True,
                                   context={'request': request}
                                   ).data
            )

    def post(self, request, *args, **kwargs):

        def do_email():
            email = EmailMessage(_('[WGF] Регистрационные данные'),
                                 '',
                                 settings.DEFAULT_FROM_EMAIL,
                                 [request.user.email]
                                 )

            email.content_subtype = 'html'
            email.attach('Contract.pdf', generate_contract(contract), 'application/pdf')
            # catch fails on local
            try:
                email.send()
            except:
                pass

        if 'pk' in self.kwargs.keys():
            contract = models.Contract.objects.get(pk=self.kwargs['pk'],
                                    organization=request.user.organization_managed)
            do_email()
            return Response({'success': True, 'id': contract.pk})
        else:
            already_in_contract = []
            contracts = models.Contract.objects.filter(
                organization=request.user.organization_managed
            )
            for contract in contracts:
                for pk in contract.participants.values_list('pk', flat=True):
                    already_in_contract.append(pk)

            users = User.objects.filter(organization=request.user.organization_managed) \
                .exclude(pk__in=already_in_contract)
            if len(users):
                contract = models.Contract.objects.create(
                    organization=request.user.organization_managed
                )
                for user in users:
                    contract.participants.add(user)
                contract.save()
                if contract.pk:
                    result = self.get_result(contract, request.user)
                    if self.email:
                        do_email()
                    return Response(result)
        return Response({'success': False, 'message': 'No users to create a contract'})


class ContractList(CommonPermissions, generics.ListAPIView):

    queryset = models.Contract.objects.all()
    serializer_class = serializers.ContractsActiveSerializer

    def filter_queryset(self, queryset):
        queryset = queryset.filter(organization=self.request.user.organization_managed,
                                   status='pending')
        return queryset
